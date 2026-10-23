(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.metaUpdate = api.metaUpdate;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var MAX_STATS = 20;

  function finiteStats(obj) {
    var out = {};
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return out;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      if (Object.keys(out).length >= MAX_STATS) break;
      var k = keys[i];
      var n = obj[k];
      if (typeof n === 'number' && Number.isFinite(n)) out[k] = n;
    }
    return out;
  }

  function metaUpdate(slug, version, patch) {
    try {
      var storage = globalThis.localStorage;
      if (!storage) return;
      var key = 'meta.v1.' + slug;
      var prev = {};
      try {
        var raw = storage.getItem(key);
        if (raw) prev = JSON.parse(raw);
      } catch (e) {
        prev = {};
      }
      if (!prev || typeof prev !== 'object' || Array.isArray(prev)) prev = {};

      var stats = finiteStats(prev.stats);
      var incoming = finiteStats(patch && patch.stats);
      var incomingKeys = Object.keys(incoming);
      for (var s = 0; s < incomingKeys.length; s++) {
        stats[incomingKeys[s]] = incoming[incomingKeys[s]];
      }
      var statKeys = Object.keys(stats);
      if (statKeys.length > MAX_STATS) {
        var trimmed = {};
        for (var t = 0; t < MAX_STATS; t++) trimmed[statKeys[t]] = stats[statKeys[t]];
        stats = trimmed;
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
        version: version,
        updatedAt: now,
        stats: stats,
        logros: ids,
        hitos: hitos
      };
      storage.setItem(key, JSON.stringify(record));
      try {
        var w = globalThis.window;
        if (w && w.parent && w.parent !== w) {
          w.parent.postMessage({ type: 'meta', key: key, data: record }, globalThis.location.origin);
        }
      } catch (e) {}
    } catch (e) {}
  }

  return { metaUpdate: metaUpdate };
});
