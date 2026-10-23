(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  var names = Object.keys(api);
  for (var i = 0; i < names.length; i++) root[names[i]] = api[names[i]];
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var SLUG = 'hexasort-party-v2';
  var SAVE_KEY = 'hexasort-party-v2.save';
  var META_KEY = 'meta.v1.hexasort-party-v2';
  var META_DEBOUNCE_MS = 1000;

  var STAT_KEYS = [
    'games_finished', // partidas terminadas
    'rounds_played', // rondas jugadas en partidas terminadas
    'placements', // pilas colocadas
    'merges', // fusiones de color
    'clears', // pilas que llegaron a 10
    'hexes_cleared', // hexágonos eliminados
    'points_scored', // puntos otorgados por eliminaciones
    'best_score', // mejor puntaje final de una partida
    'best_cascade', // mayor nivel de cascada
    'board_locks', // veces que el tablero se cerró
    'tutorials_finished', // tutoriales completados
    'human_wins', // partidas en las que un humano superó a la IA
    'four_player_games', // partidas terminadas de 4 jugadores
    'long_games', // partidas terminadas de 15 rondas
    'hard_ai_games', // partidas terminadas con IA difícil
    'ai_games', // partidas terminadas con alguna IA
    'shares', // resultados compartidos
    'max_players' // máximo de jugadores en una partida terminada
  ];

  var MAX_KEYS = { best_score: 1, best_cascade: 1, max_players: 1 };

  var LOGROS = [
    { id: 'first_game', when: function (s) { return (s.games_finished || 0) >= 1; } }, // terminar una partida
    { id: 'first_clear', when: function (s) { return (s.clears || 0) >= 1; } }, // eliminar una pila de 10
    { id: 'first_cascade', when: function (s) { return (s.best_cascade || 0) >= 2; } }, // encadenar una fusión
    { id: 'cascade_5', when: function (s) { return (s.best_cascade || 0) >= 5; } }, // cascada de nivel 5
    { id: 'score_100', when: function (s) { return (s.best_score || 0) >= 100; } }, // 100 puntos en una partida
    { id: 'score_500', when: function (s) { return (s.best_score || 0) >= 500; } }, // 500 puntos en una partida
    { id: 'ten_games', when: function (s) { return (s.games_finished || 0) >= 10; } }, // terminar 10 partidas
    { id: 'clears_50', when: function (s) { return (s.clears || 0) >= 50; } }, // eliminar 50 pilas
    { id: 'board_lock', when: function (s) { return (s.board_locks || 0) >= 1; } }, // llenar el tablero una vez
    { id: 'full_table', when: function (s) { return (s.four_player_games || 0) >= 1; } }, // terminar una partida de 4
    { id: 'long_match', when: function (s) { return (s.long_games || 0) >= 1; } }, // terminar una partida de 15 rondas
    { id: 'tutorial_done', when: function (s) { return (s.tutorials_finished || 0) >= 1; } } // completar el tutorial
  ];

  var SAVE = null;
  var saveExtra = {};
  var saveReadable = false;
  var metaVersion = '';
  var metaDirty = false;
  var metaTimer = null;
  var metaLastWrite = 0;

  function defaultSave() {
    var s = {};
    for (var i = 0; i < STAT_KEYS.length; i++) s[STAT_KEYS[i]] = 0;
    return s;
  }

  function ls() {
    return globalThis.localStorage;
  }

  function loadProgress() {
    SAVE = defaultSave();
    saveExtra = {};
    saveReadable = false;
    metaDirty = false;
    metaLastWrite = 0;
    if (metaTimer != null) {
      try { clearTimeout(metaTimer); } catch (e) {}
      metaTimer = null;
    }
    try {
      var storage = ls();
      if (!storage) return;
      var raw = storage.getItem(SAVE_KEY);
      if (raw == null) {
        saveReadable = true;
        return;
      }
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || Array.isArray(data)) return;
      var keys = Object.keys(data);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var n = data[k];
        if (typeof n === 'number' && Number.isFinite(n) && STAT_KEYS.indexOf(k) !== -1) SAVE[k] = n;
        else saveExtra[k] = n;
      }
      saveReadable = true;
    } catch (e) {
      saveReadable = false;
    }
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
    for (var i = 0; i < STAT_KEYS.length; i++) {
      var n = SAVE[STAT_KEYS[i]];
      if (typeof n === 'number' && Number.isFinite(n)) stats[STAT_KEYS[i]] = n;
    }
    var extras = Object.keys(saveExtra);
    for (var j = 0; j < extras.length; j++) {
      if (Object.keys(stats).length >= 20) break;
      var k = extras[j];
      var v = saveExtra[k];
      if (typeof v === 'number' && Number.isFinite(v)) stats[k] = v;
    }
    return stats;
  }

  function persistSave() {
    try {
      if (!saveReadable) return;
      var storage = ls();
      if (!storage) return;
      var prev = {};
      try {
        var raw = storage.getItem(SAVE_KEY);
        if (raw != null) {
          var parsed = JSON.parse(raw);
          if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return;
          prev = parsed;
        }
      } catch (e) {
        return;
      }
      var next = {};
      var prevKeys = Object.keys(prev);
      for (var i = 0; i < prevKeys.length; i++) next[prevKeys[i]] = prev[prevKeys[i]];
      for (var j = 0; j < STAT_KEYS.length; j++) next[STAT_KEYS[j]] = SAVE[STAT_KEYS[j]];
      storage.setItem(SAVE_KEY, JSON.stringify(next));
    } catch (e) {}
  }

  function writeMeta() {
    try {
      if (typeof globalThis.metaUpdate !== 'function') return;
      persistSave();
      globalThis.metaUpdate(SLUG, metaVersion, { stats: statsSnapshot(), logros: unlockedIds(SAVE) });
    } catch (e) {}
  }

  function runScheduledMeta() {
    metaTimer = null;
    try {
      if (!metaDirty || !saveReadable) return;
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
      if (!saveReadable) return;
      metaDirty = true;
      if (metaTimer != null) return;
      var wait = Math.max(0, META_DEBOUNCE_MS - (Date.now() - metaLastWrite));
      metaTimer = setTimeout(runScheduledMeta, wait);
    } catch (e) {}
  }

  function flushProgressNow() {
    try {
      if (!metaDirty || !saveReadable) return;
      if (metaTimer != null) {
        try { clearTimeout(metaTimer); } catch (e) {}
        metaTimer = null;
      }
      metaDirty = false;
      metaLastWrite = Date.now();
      writeMeta();
    } catch (e) {}
  }

  function bumpProgress(partial) {
    try {
      if (!saveReadable || !partial || typeof partial !== 'object') return;
      var changed = false;
      for (var i = 0; i < STAT_KEYS.length; i++) {
        var k = STAT_KEYS[i];
        if (!Object.prototype.hasOwnProperty.call(partial, k)) continue;
        var n = partial[k];
        if (typeof n !== 'number' || !Number.isFinite(n)) continue;
        if (MAX_KEYS[k]) SAVE[k] = Math.max(SAVE[k], n);
        else SAVE[k] += n;
        changed = true;
      }
      if (changed) scheduleMeta();
    } catch (e) {}
  }

  function backfillMeta(version) {
    try {
      if (typeof version === 'string') metaVersion = version;
      if (!saveReadable) return;
      var storage = ls();
      if (!storage) return;
      var raw = null;
      try { raw = storage.getItem(META_KEY); } catch (e) { return; }
      if (raw != null) return;
      if (typeof globalThis.metaUpdate !== 'function') return;
      globalThis.metaUpdate(SLUG, metaVersion, { stats: statsSnapshot(), logros: unlockedIds(SAVE) });
      metaLastWrite = Date.now();
    } catch (e) {}
  }

  try {
    if (typeof globalThis.addEventListener === 'function') {
      globalThis.addEventListener('pagehide', function () { flushProgressNow(); });
    }
  } catch (e) {}

  return {
    SLUG: SLUG,
    SAVE_KEY: SAVE_KEY,
    META_KEY: META_KEY,
    STAT_KEYS: STAT_KEYS,
    LOGROS: LOGROS,
    loadProgress: loadProgress,
    bumpProgress: bumpProgress,
    backfillMeta: backfillMeta,
    flushProgressNow: flushProgressNow
  };
});
