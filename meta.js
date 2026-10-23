(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.metaUpdate = api.metaUpdate;
  root.Meta = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var MAX_STATS = 20;

  var FASE = Object.freeze({ IDEA: 1, DEFINICION: 2, DISENO: 3, CONSTRUCCION: 4, VALIDACION: 5, LANZAMIENTO_Y_MANTENIMIENTO: 6, DESCARTADA: 7 });
  var ESTADO_FASE = Object.freeze({ PENDIENTE: 0, EN_CURSO: 1, BLOQUEADA: 2, EN_REVISION: 3, COMPLETADA: 4 });
  var TIPO_STAT = Object.freeze({ TOTAL_ACUMULADO: 'total_acumulado', MEJOR_MARCA: 'mejor_marca', VALOR_ACTUAL: 'valor_actual' });

  var PROYECTO = {
    objetivo: 'Juego web público de fiesta por turnos de apilar hexágonos, en Pages.',
    fase: FASE.DISENO,
    fase_estado: ESTADO_FASE.EN_CURSO,
    fases_completadas: 2
  };

  var proyectoSource = PROYECTO;

  function proyectoInt(n, lo, hi) {
    return typeof n === 'number' && Number.isInteger(n) && n >= lo && n <= hi;
  }

  function enumValido(enumeracion, valor) {
    return Object.values(enumeracion).indexOf(valor) !== -1;
  }

  function statConservaMaximo(tipo) {
    return tipo === TIPO_STAT.TOTAL_ACUMULADO || tipo === TIPO_STAT.MEJOR_MARCA;
  }

  function statsDeclarados(stats) {
    if (Array.isArray(stats)) return stats;
    if (!stats || typeof stats !== 'object') return [];
    return Object.keys(stats).map(function (key) { return { key: key, tipo: stats[key] && stats[key].tipo }; });
  }

  function metaProyecto(p) {
    try {
      if (!p || typeof p !== 'object' || Array.isArray(p)) return null;
      var o = p.objetivo;
      if (typeof o !== 'string' || !o.trim() || Array.from(o).length > 140) return null;
      if (!enumValido(FASE, p.fase) || !enumValido(ESTADO_FASE, p.fase_estado) || !proyectoInt(p.fases_completadas, 0, FASE.LANZAMIENTO_Y_MANTENIMIENTO)) return null;
      return { objetivo: o, fase: p.fase, fase_estado: p.fase_estado, fases_completadas: p.fases_completadas };
    } catch (e) {
      return null;
    }
  }

  function metaSetProyecto(p) {
    proyectoSource = p === null ? PROYECTO : p;
  }

  function withProyecto(record) {
    var p = metaProyecto(proyectoSource);
    if (p) record.proyecto = p;
    return record;
  }

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

  function isValidRecord(parsed, slug) {
    return !!parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.v === 1 && parsed.slug === slug;
  }

  function declaredKeys(patch) {
    var list = statsDeclarados(patch && patch.declared);
    var seen = Object.create(null);
    var out = [];
    for (var i = 0; i < list.length && out.length < MAX_STATS; i++) {
      var item = list[i];
      var key = item && typeof item.key === 'string' ? item.key : '';
      if (!key || seen[key]) continue;
      seen[key] = 1;
      out.push({ key: key, tipo: item.tipo });
    }
    return out;
  }

  function metaUpdate(slug, version, patch) {
    try {
      if (inDemo()) return;
      var storage = globalThis.localStorage;
      if (!storage) return;
      var key = 'meta.v1.' + slug;
      var prev = {};
      var raw = null;
      try { raw = storage.getItem(key); } catch (e) { raw = null; }
      if (raw != null) {
        var parsed = null;
        try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }
        if (isValidRecord(parsed, slug)) prev = parsed;
        else {
          try { storage.setItem(key + '.corrupt', raw); } catch (e) {}
          prev = {};
        }
      }

      var prevStats = prev.stats && typeof prev.stats === 'object' && !Array.isArray(prev.stats) ? prev.stats : {};
      var incoming = patch && patch.stats && typeof patch.stats === 'object' && !Array.isArray(patch.stats) ? patch.stats : {};
      var decl = declaredKeys(patch);
      var stats = {};
      for (var i = 0; i < decl.length; i++) {
        var item = decl[i];
        var k = item.key;
        var next = incoming[k];
        var old = prevStats[k];
        var hasNext = typeof next === 'number' && Number.isFinite(next);
        var hasOld = typeof old === 'number' && Number.isFinite(old);
        if (hasNext && hasOld && statConservaMaximo(item.tipo)) stats[k] = Math.max(old, next);
        else if (hasNext) stats[k] = next;
        else if (hasOld) stats[k] = old;
      }

      var prevLogros = Array.isArray(prev.logros) ? prev.logros : [];
      var prevHitos = prev.hitos && typeof prev.hitos === 'object' && !Array.isArray(prev.hitos) ? prev.hitos : {};
      var seen = Object.create(null);
      var ids = [];
      function addId(id) {
        if (typeof id !== 'string' || !id || seen[id]) return;
        seen[id] = 1;
        ids.push(id);
      }
      for (var a = 0; a < prevLogros.length; a++) addId(prevLogros[a]);
      var incomingLogros = patch && Array.isArray(patch.logros) ? patch.logros : [];
      for (var b = 0; b < incomingLogros.length; b++) addId(incomingLogros[b]);
      ids.sort();

      var now = new Date().toISOString();
      var hitos = {};
      for (var h = 0; h < ids.length; h++) {
        var id = ids[h];
        hitos[id] = typeof prevHitos[id] === 'string' ? prevHitos[id] : now;
      }

      var record = {
        v: 1,
        slug: slug,
        version: plainVersion(version),
        updatedAt: now,
        stats: stats,
        logros: ids,
        hitos: hitos
      };
      withProyecto(record);
      storage.setItem(key, JSON.stringify(record));
      try {
        var w = globalThis.window;
        if (w && w.parent && w.parent !== w) {
          w.parent.postMessage({ type: 'meta', key: key, data: record }, globalThis.location.origin);
        }
      } catch (e) {}
    } catch (e) {}
  }

  return {
    metaUpdate: metaUpdate,
    metaProyecto: metaProyecto,
    metaSetProyecto: metaSetProyecto,
    PROYECTO: PROYECTO,
    FASE: FASE,
    ESTADO_FASE: ESTADO_FASE,
    TIPO_STAT: TIPO_STAT,
    enumValido: enumValido,
    statConservaMaximo: statConservaMaximo,
    statsDeclarados: statsDeclarados
  };
});
