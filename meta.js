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
  var TIPO_PROYECTO = Object.freeze({ PROYECTO: 'proyecto', AREA: 'area', RECURSO: 'recurso', ARCHIVO: 'archivo' });

  var PROYECTO = {
    objetivo: 'Juego web público de fiesta por turnos de apilar hexágonos, en Pages.',
    fase: FASE.DISENO,
    fase_estado: ESTADO_FASE.EN_CURSO,
    fases_completadas: 2,
    tipo: TIPO_PROYECTO.ARCHIVO,
    aportes: [
      { stat: 'Programación', exp: 5, fuente: 'creacion' },
      { stat: 'Diseño', exp: 12, fuente: 'creacion' },
      { stat: 'Lógica espacial', exp: 20, fuente: 'uso' }
    ]
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

  var APORTE_STAT_MAX = 32;
  var APORTE_EXP_MAX = 99;

  function aportesValidos(lista) {
    if (!Array.isArray(lista)) return null;
    var out = [];
    var seen = {};
    for (var i = 0; i < lista.length; i++) {
      var it = lista[i];
      if (!it || typeof it !== 'object' || Array.isArray(it)) return null;
      var stat = it.stat;
      var exp = it.exp;
      var fuente = it.fuente;
      if (typeof stat !== 'string' || !stat.trim() || stat !== stat.trim() || Array.from(stat).length > APORTE_STAT_MAX) return null;
      if (fuente !== 'creacion' && fuente !== 'uso') return null;
      if (!(proyectoInt(exp, 1, APORTE_EXP_MAX))) return null;
      var key = stat + '\n' + fuente;
      if (seen[key]) return null;
      if (Object.keys(it).length !== 3) return null;
      seen[key] = true;
      out.push({ stat: stat, exp: exp, fuente: fuente });
    }
    return out;
  }

  function metaProyecto(p) {
    try {
      if (!p || typeof p !== 'object' || Array.isArray(p)) return null;
      var o = p.objetivo;
      if (typeof o !== 'string' || !o.trim() || Array.from(o).length > 140) return null;
      if (!enumValido(FASE, p.fase) || !enumValido(ESTADO_FASE, p.fase_estado) || !proyectoInt(p.fases_completadas, 0, FASE.LANZAMIENTO_Y_MANTENIMIENTO)) return null;
      if (p.tipo !== undefined && !enumValido(TIPO_PROYECTO, p.tipo)) return null;
      var bloque = { objetivo: o, fase: p.fase, fase_estado: p.fase_estado, fases_completadas: p.fases_completadas };
      if (p.tipo !== undefined) bloque.tipo = p.tipo;
      if (p.bloqueada === true) bloque.bloqueada = true;
      if (p.aportes !== undefined) {
        var aportes = aportesValidos(p.aportes);
        if (!aportes) return null;
        bloque.aportes = aportes;
      }
      return bloque;
    } catch (e) {
      return null;
    }
  }

  function metaSetProyecto(p) {
    proyectoSource = p === null ? PROYECTO : p;
  }

  function metaDeclararProyecto(slug, version) {
    try {
      var store = globalThis.localStorage;
      if (!store || !slug) return null;
      var clave = 'meta.v1.' + slug;
      var raw = store.getItem(clave);
      var base = null;
      if (raw != null && raw !== '') {
        try {
          var previo = JSON.parse(raw);
          if (previo && typeof previo === 'object' && !Array.isArray(previo) && previo.v === 1 && previo.slug === slug) base = previo;
        } catch (e) {
          base = null;
        }
        if (!base) store.setItem(clave + '.corrupt', String(raw));
      }
      if (!base) base = { v: 1, slug: slug, version: String(version == null ? '' : version).replace(/^[vV]/, ''), updatedAt: new Date().toISOString(), stats: {}, logros: [], hitos: {} };
      var p = metaProyecto(proyectoSource);
      if (p) base.proyecto = p;
      var texto = JSON.stringify(base);
      if (texto !== raw) {
        store.setItem(clave, texto);
        if (typeof window !== 'undefined' && window.parent && window.parent !== window) window.parent.postMessage({ type: 'meta', key: clave, data: base }, location.origin);
      }
      return base;
    } catch (e) {
      return null;
    }
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
    metaDeclararProyecto: metaDeclararProyecto,
    PROYECTO: PROYECTO,
    FASE: FASE,
    ESTADO_FASE: ESTADO_FASE,
    TIPO_STAT: TIPO_STAT,
    TIPO_PROYECTO: TIPO_PROYECTO,
    enumValido: enumValido,
    statConservaMaximo: statConservaMaximo,
    statsDeclarados: statsDeclarados
  };
});
