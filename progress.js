(function (root, factory) {
  var api = factory(typeof module === 'object' && module.exports ? require('./meta.js') : root.Meta);
  if (typeof module === 'object' && module.exports) module.exports = api;
  var names = Object.keys(api);
  for (var i = 0; i < names.length; i++) root[names[i]] = api[names[i]];
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Meta) {
  var SLUG = 'hexasort-party-v2';
  var SAVE_KEY = 'hexasort-party-v2.save';
  var META_KEY = 'meta.v1.hexasort-party-v2';
  var CORRUPT_KEY = 'meta.v1.hexasort-party-v2.corrupt';
  var META_DEBOUNCE_MS = 1000;

  var TIPO_STAT = Meta.TIPO_STAT;

  var STATS = Object.freeze({
    games_finished: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'partidas terminadas' },
    rounds_played: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'rondas jugadas' },
    placements: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'pilas colocadas en el tablero' },
    merges: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'fusiones de pilas' },
    clears: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'pilas completadas y retiradas' },
    hexes_cleared: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'hexágonos retirados' },
    points_scored: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'puntos' },
    best_score: { tipo: TIPO_STAT.MEJOR_MARCA, unidad: 'puntos en una partida' },
    best_cascade: { tipo: TIPO_STAT.MEJOR_MARCA, unidad: 'retiros encadenados en una jugada' },
    board_locks: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'tableros bloqueados sin espacio' },
    tutorials_finished: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'tutoriales terminados' },
    human_wins: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'partidas ganadas por un humano' },
    four_player_games: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'partidas de 4 jugadores' },
    long_games: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'partidas largas' },
    hard_ai_games: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'partidas contra IA difícil' },
    ai_games: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'partidas con IA' },
    shares: { tipo: TIPO_STAT.TOTAL_ACUMULADO, unidad: 'veces compartido' },
    max_players: { tipo: TIPO_STAT.MEJOR_MARCA, unidad: 'jugadores en una partida' }
  });
  var STAT_KEYS = Object.keys(STATS);

  var LOGROS = [
    { id: 'first_game', when: function (s) { return (s.games_finished || 0) >= 1; } },
    { id: 'first_clear', when: function (s) { return (s.clears || 0) >= 1; } },
    { id: 'first_cascade', when: function (s) { return (s.best_cascade || 0) >= 2; } },
    { id: 'cascade_5', when: function (s) { return (s.best_cascade || 0) >= 5; } },
    { id: 'score_100', when: function (s) { return (s.best_score || 0) >= 100; } },
    { id: 'score_500', when: function (s) { return (s.best_score || 0) >= 500; } },
    { id: 'ten_games', when: function (s) { return (s.games_finished || 0) >= 10; } },
    { id: 'clears_50', when: function (s) { return (s.clears || 0) >= 50; } },
    { id: 'board_lock', when: function (s) { return (s.board_locks || 0) >= 1; } },
    { id: 'full_table', when: function (s) { return (s.four_player_games || 0) >= 1; } },
    { id: 'long_match', when: function (s) { return (s.long_games || 0) >= 1; } },
    { id: 'tutorial_done', when: function (s) { return (s.tutorials_finished || 0) >= 1; } }
  ];

  var SAVE = null;
  var metaVersion = '';
  var metaDirty = false;
  var metaTimer = null;
  var metaLastWrite = 0;
  var sandbox = false;

  function plainVersion(version) {
    var s = typeof version === 'string' ? version : '';
    if (s.charAt(0) === 'v' || s.charAt(0) === 'V') s = s.slice(1);
    return s;
  }

  function inDemo() {
    try {
      var loc = globalThis.location;
      var q = loc && typeof loc.search === 'string' ? loc.search : '';
      if (!q) return false;
      var body = q.charAt(0) === '?' ? q.slice(1) : q;
      var parts = body.split('&');
      for (var i = 0; i < parts.length; i++) {
        var eq = parts[i].split('=');
        var name = '';
        var val = '';
        try {
          name = decodeURIComponent(eq[0] || '');
          val = decodeURIComponent((eq[1] || '').replace(/\+/g, ' '));
        } catch (e) { continue; }
        if ((name === 'demo' || name === 'preview') && val === '1') return true;
      }
    } catch (e) {}
    return false;
  }

  function blocked() {
    return sandbox || inDemo();
  }

  function defaultSave() {
    var s = {};
    var n = Math.min(20, STAT_KEYS.length);
    for (var i = 0; i < n; i++) s[STAT_KEYS[i]] = 0;
    return s;
  }

  function ls() {
    return globalThis.localStorage;
  }

  function applyNumbers(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;
    var n = Math.min(20, STAT_KEYS.length);
    for (var i = 0; i < n; i++) {
      var key = STAT_KEYS[i];
      var v = obj[key];
      if (typeof v !== 'number' || !Number.isFinite(v)) continue;
      if (Meta.statConservaMaximo(STATS[key].tipo)) SAVE[key] = Math.max(SAVE[key], v);
      else SAVE[key] = v;
    }
  }

  function readSave() {
    SAVE = defaultSave();
    try {
      var storage = ls();
      if (!storage) return;
      var raw = storage.getItem(SAVE_KEY);
      if (raw == null) return;
      applyNumbers(JSON.parse(raw));
    } catch (e) {}
  }

  function loadProgress() {
    sandbox = false;
    metaDirty = false;
    metaLastWrite = 0;
    if (metaTimer != null) {
      try { clearTimeout(metaTimer); } catch (e) {}
      metaTimer = null;
    }
    readSave();
  }

  function unlockedIds(save) {
    var ids = [];
    for (var i = 0; i < LOGROS.length; i++) {
      try { if (LOGROS[i].when(save)) ids.push(LOGROS[i].id); } catch (e) {}
    }
    ids.sort();
    return ids;
  }

  function statsSnapshot() {
    var stats = {};
    var n = Math.min(20, STAT_KEYS.length);
    for (var i = 0; i < n; i++) {
      var key = STAT_KEYS[i];
      var v = SAVE[key];
      if (typeof v === 'number' && Number.isFinite(v)) stats[key] = v;
    }
    return stats;
  }

  function isValidRecord(parsed) {
    return !!parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.v === 1 && parsed.slug === SLUG;
  }

  function writeMeta() {
    try {
      if (blocked()) return;
      if (typeof globalThis.metaUpdate !== 'function') return;
      globalThis.metaUpdate(SLUG, metaVersion, { stats: statsSnapshot(), logros: unlockedIds(SAVE), declared: STATS });
    } catch (e) {}
  }

  function runScheduledMeta() {
    metaTimer = null;
    try {
      if (!metaDirty || blocked()) return;
      var wait = META_DEBOUNCE_MS - (Date.now() - metaLastWrite);
      if (wait > 0) {
        metaTimer = setTimeout(runScheduledMeta, wait);
        return;
      }
      metaDirty = false;
      metaLastWrite = Date.now();
      writeMeta();
    } catch (e) {}
  }

  function scheduleMeta() {
    try {
      if (blocked()) return;
      metaDirty = true;
      if (metaTimer != null) return;
      var wait = Math.max(0, META_DEBOUNCE_MS - (Date.now() - metaLastWrite));
      metaTimer = setTimeout(runScheduledMeta, wait);
    } catch (e) {}
  }

  function flushProgressNow() {
    try {
      if (blocked()) return;
      if (!metaDirty) return;
      if (metaTimer != null) {
        try { clearTimeout(metaTimer); } catch (e) {}
        metaTimer = null;
      }
      metaDirty = false;
      metaLastWrite = Date.now();
      writeMeta();
    } catch (e) {}
  }

  function onVisibilityChange() {
    try {
      var doc = globalThis.document;
      if (doc && doc.visibilityState === 'hidden') flushProgressNow();
    } catch (e) {}
  }

  function bindMetaFlush() {
    try {
      if (typeof globalThis.addEventListener === 'function') {
        globalThis.addEventListener('pagehide', function () { flushProgressNow(); });
      }
    } catch (e) {}
    try {
      var doc = globalThis.document;
      var visTarget = doc && typeof doc.addEventListener === 'function' ? doc : globalThis;
      if (typeof visTarget.addEventListener === 'function') {
        visTarget.addEventListener('visibilitychange', onVisibilityChange);
      }
    } catch (e) {}
  }

  function bumpProgress(partial) {
    try {
      if (blocked() || !partial || typeof partial !== 'object') return;
      var changed = false;
      var n = Math.min(20, STAT_KEYS.length);
      for (var i = 0; i < n; i++) {
        var key = STAT_KEYS[i];
        if (!Object.prototype.hasOwnProperty.call(partial, key)) continue;
        var v = partial[key];
        if (typeof v !== 'number' || !Number.isFinite(v)) continue;
        if (STATS[key].tipo === TIPO_STAT.MEJOR_MARCA) SAVE[key] = Math.max(SAVE[key], v);
        else SAVE[key] += v;
        changed = true;
      }
      if (changed) scheduleMeta();
    } catch (e) {}
  }

  function backfillMeta(version) {
    try {
      if (typeof version === 'string') metaVersion = plainVersion(version);
      if (blocked()) return;
      var storage = ls();
      if (!storage) return;
      var raw = null;
      try { raw = storage.getItem(META_KEY); } catch (e) { return; }
      if (raw != null) {
        var parsed = null;
        try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }
        if (isValidRecord(parsed)) {
          SAVE = defaultSave();
          applyNumbers(parsed.stats);
          return;
        }
      }
      if (typeof globalThis.metaUpdate !== 'function') return;
      writeMeta();
      metaLastWrite = Date.now();
    } catch (e) {}
  }

  function setProgressSandbox(on) {
    try {
      sandbox = !!on;
      if (sandbox) {
        metaDirty = false;
        if (metaTimer != null) {
          try { clearTimeout(metaTimer); } catch (e) {}
          metaTimer = null;
        }
      }
    } catch (e) {}
  }

  bindMetaFlush();

  return {
    SLUG: SLUG,
    SAVE_KEY: SAVE_KEY,
    META_KEY: META_KEY,
    CORRUPT_KEY: CORRUPT_KEY,
    STATS: STATS,
    LOGROS: LOGROS,
    loadProgress: loadProgress,
    bumpProgress: bumpProgress,
    backfillMeta: backfillMeta,
    flushProgressNow: flushProgressNow,
    bindMetaFlush: bindMetaFlush,
    setProgressSandbox: setProgressSandbox
  };
});