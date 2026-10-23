const test = require('node:test');
const assert = require('node:assert/strict');
const { metaUpdate } = require('../meta.js');
const {
  SAVE_KEY,
  META_KEY,
  CORRUPT_KEY,
  STATS,
  loadProgress,
  backfillMeta,
  bumpProgress,
  flushProgressNow,
  bindMetaFlush,
  setProgressSandbox
} = require('../progress.js');

const VERSION = '1.4.2';

function mockStorage(seed) {
  const map = new Map();
  if (seed) {
    for (const [k, v] of Object.entries(seed)) map.set(k, v);
  }
  global.localStorage = {
    getItem(k) { return map.has(k) ? map.get(k) : null; },
    setItem(k, v) { map.set(k, String(v)); },
    removeItem(k) { map.delete(k); }
  };
  return map;
}

function withNow(iso, fn) {
  const Real = Date;
  const fixed = new Real(iso).getTime();
  global.Date = class extends Real {
    constructor(...args) {
      if (args.length === 0) super(fixed);
      else super(...args);
    }
    static now() { return fixed; }
    static parse(s) { return Real.parse(s); }
    static UTC(...args) { return Real.UTC(...args); }
  };
  try { return fn(); }
  finally { global.Date = Real; }
}

function quietPage() {
  delete global.window;
  global.location = { search: '', origin: 'https://juliangdeveloper.github.io' };
}

test('old save without meta.v1 builds the record once', () => {
  quietPage();
  const oldSave = {
    games_finished: 2,
    rounds_played: 20,
    placements: 30,
    merges: 8,
    clears: 3,
    hexes_cleared: 36,
    points_scored: 40,
    best_score: 120,
    best_cascade: 3,
    tutorials_finished: 1,
    human_wins: 1,
    four_player_games: 0,
    long_games: 0,
    hard_ai_games: 0,
    ai_games: 2,
    shares: 1,
    max_players: 3,
    extra_count: 4,
    kept_flag: true
  };
  const saveRaw = JSON.stringify(oldSave);
  mockStorage({ [SAVE_KEY]: saveRaw });
  loadProgress();
  withNow('2026-10-23T18:00:00.000Z', () => backfillMeta('v' + VERSION));

  assert.equal(localStorage.getItem(SAVE_KEY), saveRaw);
  const rec = JSON.parse(localStorage.getItem(META_KEY));
  assert.deepEqual(Object.keys(rec), ['v', 'slug', 'version', 'updatedAt', 'stats', 'logros', 'hitos']);
  assert.equal(rec.v, 1);
  assert.equal(rec.slug, 'hexasort-party-v2');
  assert.equal(rec.version, VERSION);
  assert.equal(rec.updatedAt, '2026-10-23T18:00:00.000Z');
  assert.deepEqual(Object.keys(rec.stats), STATS.map(s => s.key));
  assert.equal(rec.stats.games_finished, 2);
  assert.equal(rec.stats.rounds_played, 20);
  assert.equal(rec.stats.placements, 30);
  assert.equal(rec.stats.merges, 8);
  assert.equal(rec.stats.clears, 3);
  assert.equal(rec.stats.hexes_cleared, 36);
  assert.equal(rec.stats.points_scored, 40);
  assert.equal(rec.stats.best_score, 120);
  assert.equal(rec.stats.best_cascade, 3);
  assert.equal(rec.stats.board_locks, 0);
  assert.equal(rec.stats.tutorials_finished, 1);
  assert.equal(rec.stats.human_wins, 1);
  assert.equal(rec.stats.four_player_games, 0);
  assert.equal(rec.stats.long_games, 0);
  assert.equal(rec.stats.hard_ai_games, 0);
  assert.equal(rec.stats.ai_games, 2);
  assert.equal(rec.stats.shares, 1);
  assert.equal(rec.stats.max_players, 3);
  assert.equal('extra_count' in rec.stats, false);
  assert.equal('kept_flag' in rec.stats, false);
  assert.ok(Object.keys(rec.stats).length <= 20);
  assert.deepEqual(rec.logros, ['first_cascade', 'first_clear', 'first_game', 'score_100', 'tutorial_done']);
  assert.deepEqual(Object.keys(rec.hitos).sort(), rec.logros);
  for (const id of rec.logros) assert.equal(rec.hitos[id], '2026-10-23T18:00:00.000Z');

  const written = localStorage.getItem(META_KEY);
  backfillMeta('9.9.9');
  assert.equal(localStorage.getItem(META_KEY), written);
  assert.equal(localStorage.getItem(SAVE_KEY), saveRaw);
});

test('existing meta record is not overwritten by backfill', () => {
  quietPage();
  const existing = {
    v: 1,
    slug: 'hexasort-party-v2',
    version: 'v1.3.2',
    updatedAt: '2020-01-01T00:00:00.000Z',
    stats: { games_finished: 1, best_score: 10 },
    logros: ['first_game'],
    hitos: { first_game: '2020-01-01T00:00:00.000Z' }
  };
  const metaRaw = JSON.stringify(existing);
  const saveRaw = JSON.stringify({ games_finished: 40, best_score: 999, clears: 80, best_cascade: 6 });
  mockStorage({ [META_KEY]: metaRaw, [SAVE_KEY]: saveRaw });
  loadProgress();
  backfillMeta(VERSION);
  assert.equal(localStorage.getItem(META_KEY), metaRaw);
  assert.equal(localStorage.getItem(SAVE_KEY), saveRaw);
  assert.equal(localStorage.getItem(CORRUPT_KEY), null);
});

test('corrupt records are copied and rebuilt without crashing', () => {
  quietPage();
  const save = {
    games_finished: 2,
    clears: 3,
    best_score: 120,
    best_cascade: 3,
    tutorials_finished: 1
  };
  const saveRaw = JSON.stringify(save);
  const cases = [
    '{nope',
    'null',
    '[]',
    JSON.stringify({ v: 2, slug: 'hexasort-party-v2', stats: { games_finished: 9 } }),
    JSON.stringify({ v: 1, slug: 'other-game', stats: { games_finished: 9 } })
  ];
  for (const raw of cases) {
    mockStorage({ [META_KEY]: raw, [SAVE_KEY]: saveRaw });
    assert.doesNotThrow(() => {
      loadProgress();
      withNow('2026-10-23T18:00:00.000Z', () => backfillMeta(VERSION));
    });
    assert.equal(localStorage.getItem(CORRUPT_KEY), raw);
    assert.equal(localStorage.getItem(SAVE_KEY), saveRaw);
    const rec = JSON.parse(localStorage.getItem(META_KEY));
    assert.equal(rec.v, 1);
    assert.equal(rec.slug, 'hexasort-party-v2');
    assert.equal(rec.version, VERSION);
    assert.equal(rec.stats.games_finished, 2);
    assert.equal(rec.stats.best_score, 120);
    assert.equal(rec.hitos.first_game, '2026-10-23T18:00:00.000Z');
    assert.ok(rec.logros.includes('first_game'));
    assert.ok(rec.logros.includes('score_100'));
  }

  const badSave = '{also-bad';
  mockStorage({ [META_KEY]: '{nope', [SAVE_KEY]: badSave });
  assert.doesNotThrow(() => {
    loadProgress();
    backfillMeta(VERSION);
  });
  assert.equal(localStorage.getItem(SAVE_KEY), badSave);
  assert.equal(localStorage.getItem(CORRUPT_KEY), '{nope');
  const rebuilt = JSON.parse(localStorage.getItem(META_KEY));
  assert.equal(rebuilt.stats.games_finished, 0);
  assert.deepEqual(rebuilt.logros, []);
});

test('metaUpdate keeps hitos, unions logros, and posts to the parent', () => {
  const messages = [];
  const frame = {
    parent: {
      postMessage(data, origin) { messages.push({ data, origin }); }
    }
  };
  global.window = frame;
  global.location = { search: '', origin: 'https://juliangdeveloper.github.io' };
  mockStorage({
    [META_KEY]: JSON.stringify({
      v: 1,
      slug: 'hexasort-party-v2',
      version: '1.3.2',
      updatedAt: '2020-01-01T00:00:00.000Z',
      stats: { games_finished: 1, best_score: 10, shares: 4 },
      logros: ['first_game'],
      hitos: { first_game: '2020-01-01T00:00:00.000Z' }
    })
  });
  const declared = [
    { key: 'games_finished', monotonic: true },
    { key: 'best_score', monotonic: true },
    { key: 'shares', monotonic: true },
    { key: 'rounds_played', monotonic: false }
  ];
  try {
    withNow('2026-10-23T18:00:00.000Z', () => {
      metaUpdate('hexasort-party-v2', 'v1.4.2', {
        stats: { games_finished: 2, best_score: NaN, rounds_played: 3, label: 'no', inf: Infinity },
        logros: ['score_100', 'first_game', 'score_100'],
        declared
      });
    });
    const rec = JSON.parse(localStorage.getItem(META_KEY));
    assert.equal(rec.hitos.first_game, '2020-01-01T00:00:00.000Z');
    assert.equal(rec.hitos.score_100, '2026-10-23T18:00:00.000Z');
    assert.deepEqual(rec.logros, ['first_game', 'score_100']);
    assert.equal(rec.stats.games_finished, 2);
    assert.equal(rec.stats.best_score, 10);
    assert.equal(rec.stats.shares, 4);
    assert.equal(rec.stats.rounds_played, 3);
    assert.equal('label' in rec.stats, false);
    assert.equal('inf' in rec.stats, false);
    assert.deepEqual(Object.keys(rec.stats), ['games_finished', 'best_score', 'shares', 'rounds_played']);
    assert.equal(rec.version, VERSION);
    assert.equal(rec.updatedAt, '2026-10-23T18:00:00.000Z');
    assert.equal(messages.length, 1);
    assert.equal(messages[0].origin, 'https://juliangdeveloper.github.io');
    assert.equal(messages[0].data.type, 'meta');
    assert.equal(messages[0].data.key, 'meta.v1.hexasort-party-v2');
    assert.equal(messages[0].data.data.slug, 'hexasort-party-v2');
    assert.equal(messages[0].data.data.version, VERSION);
  } finally {
    delete global.window;
    global.location = { search: '', origin: 'https://juliangdeveloper.github.io' };
  }
});

test('declared stats are capped at 20 and undeclared keys are dropped', () => {
  quietPage();
  const declared = [];
  const stats = { extra_count: 9 };
  for (let i = 0; i < 25; i++) {
    const key = 's_' + String(i).padStart(2, '0');
    declared.push({ key, monotonic: i % 2 === 0 });
    stats[key] = i;
  }
  mockStorage({
    [META_KEY]: JSON.stringify({
      v: 1,
      slug: 'hexasort-party-v2',
      version: '1.4.0',
      updatedAt: '2020-01-01T00:00:00.000Z',
      stats: { s_00: 100, old_extra: 7 },
      logros: [],
      hitos: {}
    })
  });
  metaUpdate('hexasort-party-v2', VERSION, { stats, logros: [], declared });
  const rec = JSON.parse(localStorage.getItem(META_KEY));
  assert.deepEqual(Object.keys(rec.stats), declared.slice(0, 20).map(item => item.key));
  assert.equal(Object.keys(rec.stats).length, 20);
  assert.equal(rec.stats.s_00, 100);
  assert.equal(rec.stats.s_01, 1);
  assert.equal('s_20' in rec.stats, false);
  assert.equal('extra_count' in rec.stats, false);
  assert.equal('old_extra' in rec.stats, false);
});

test('monotonic stats keep the greater value', () => {
  quietPage();
  mockStorage({
    [META_KEY]: JSON.stringify({
      v: 1,
      slug: 'hexasort-party-v2',
      version: '1.4.0',
      updatedAt: '2020-01-01T00:00:00.000Z',
      stats: { games_finished: 10, best_score: 80, placements: 4 },
      logros: [],
      hitos: {}
    })
  });
  metaUpdate('hexasort-party-v2', VERSION, {
    stats: { games_finished: 3, best_score: 50, placements: NaN, rounds_played: 2, extra_count: 8 },
    logros: [],
    declared: [
      { key: 'games_finished', monotonic: true },
      { key: 'best_score', monotonic: true },
      { key: 'placements', monotonic: true },
      { key: 'rounds_played', monotonic: false }
    ]
  });
  const rec = JSON.parse(localStorage.getItem(META_KEY));
  assert.equal(rec.stats.games_finished, 10);
  assert.equal(rec.stats.best_score, 80);
  assert.equal(rec.stats.placements, 4);
  assert.equal(rec.stats.rounds_played, 2);
  assert.equal('extra_count' in rec.stats, false);
});

test('normal writes stay at one per second, including backfill', () => {
  quietPage();
  const messages = [];
  global.window = {
    parent: { postMessage(data, origin) { messages.push({ data, origin }); } }
  };
  mockStorage({});
  const writes = [];
  const origSet = localStorage.setItem;
  localStorage.setItem = function (k, v) {
    writes.push({ k, t: Date.now() });
    return origSet.call(localStorage, k, v);
  };
  const origTimeout = global.setTimeout;
  const origNow = Date.now;
  const timers = [];
  global.setTimeout = (fn, ms) => {
    timers.push({ fn, ms });
    return timers.length;
  };
  try {
    loadProgress();
    backfillMeta(VERSION);
    assert.equal(writes.length, 1);
    assert.equal(writes[0].k, META_KEY);
    assert.equal(messages.length, 1);
    bumpProgress({ placements: 1 });
    bumpProgress({ placements: 1, merges: 1 });
    assert.equal(timers.length, 1);
    assert.ok(timers[0].ms > 0 && timers[0].ms <= 1000);
    assert.equal(writes.length, 1);
    assert.equal(messages.length, 1);
    Date.now = () => origNow.call(Date) + 2000;
    timers[0].fn();
    assert.equal(writes.length, 2);
    assert.ok(writes[1].t - writes[0].t >= 1000);
    assert.equal(messages.length, 2);
    const rec = JSON.parse(localStorage.getItem(META_KEY));
    assert.equal(rec.stats.placements, 2);
    assert.equal(rec.stats.merges, 1);
    assert.equal(rec.version, VERSION);
  } finally {
    global.setTimeout = origTimeout;
    Date.now = origNow;
    delete global.window;
    global.location = { search: '', origin: 'https://juliangdeveloper.github.io' };
  }
});

test('pagehide and hidden visibility flush a pending change immediately', () => {
  quietPage();
  const messages = [];
  global.window = {
    parent: { postMessage(data, origin) { messages.push({ data, origin }); } }
  };
  const listeners = {};
  function addEventListener(type, fn) {
    if (!listeners[type]) listeners[type] = [];
    listeners[type].push(fn);
  }
  function dispatch(type) {
    (listeners[type] || []).forEach(fn => fn());
  }
  global.addEventListener = addEventListener;
  global.document = { visibilityState: 'visible', addEventListener };
  bindMetaFlush();
  mockStorage({});
  const writes = [];
  const origSet = localStorage.setItem;
  localStorage.setItem = function (k, v) {
    writes.push({ k, t: Date.now() });
    return origSet.call(localStorage, k, v);
  };
  const origTimeout = global.setTimeout;
  global.setTimeout = (fn, ms) => ({ fn, ms });
  try {
    loadProgress();
    backfillMeta(VERSION);
    assert.equal(writes.length, 1);
    bumpProgress({ placements: 1 });
    assert.equal(writes.length, 1);
    dispatch('pagehide');
    assert.equal(writes.length, 2);
    assert.equal(messages.length, 2);
    assert.equal(JSON.parse(localStorage.getItem(META_KEY)).stats.placements, 1);
    assert.equal(messages[1].data.type, 'meta');
    dispatch('pagehide');
    assert.equal(writes.length, 2);
    assert.equal(messages.length, 2);

    bumpProgress({ merges: 1 });
    global.document.visibilityState = 'visible';
    dispatch('visibilitychange');
    assert.equal(writes.length, 2);
    global.document.visibilityState = 'hidden';
    dispatch('visibilitychange');
    assert.equal(writes.length, 3);
    assert.equal(messages.length, 3);
    assert.equal(JSON.parse(localStorage.getItem(META_KEY)).stats.merges, 1);
    dispatch('visibilitychange');
    assert.equal(writes.length, 3);
    assert.equal(messages.length, 3);
  } finally {
    global.setTimeout = origTimeout;
    delete global.addEventListener;
    delete global.document;
    delete global.window;
    global.location = { search: '', origin: 'https://juliangdeveloper.github.io' };
  }
});

test('demo and preview modes do not write or postMessage', () => {
  const messages = [];
  global.window = {
    parent: { postMessage() { messages.push(1); } }
  };
  for (const search of ['?demo=1', '?x=2&preview=1', '?demo=1&y=3']) {
    messages.length = 0;
    global.location = { search, origin: 'https://juliangdeveloper.github.io' };
    mockStorage({ [SAVE_KEY]: JSON.stringify({ games_finished: 6, best_score: 200 }) });
    const writes = [];
    const origSet = localStorage.setItem;
    localStorage.setItem = function (k, v) {
      writes.push(k);
      return origSet.call(localStorage, k, v);
    };
    loadProgress();
    backfillMeta(VERSION);
    bumpProgress({ placements: 4, games_finished: 1 });
    flushProgressNow();
    metaUpdate('hexasort-party-v2', VERSION, {
      stats: { games_finished: 6 },
      logros: ['first_game'],
      declared: STATS
    });
    assert.equal(localStorage.getItem(META_KEY), null);
    assert.deepEqual(writes, []);
    assert.equal(messages.length, 0);
    assert.equal(localStorage.getItem(SAVE_KEY), JSON.stringify({ games_finished: 6, best_score: 200 }));
  }
  delete global.window;
  global.location = { search: '', origin: 'https://juliangdeveloper.github.io' };
});

test('tutorial sandbox does not write fake progress', () => {
  quietPage();
  mockStorage({});
  loadProgress();
  backfillMeta(VERSION);
  const afterLoad = localStorage.getItem(META_KEY);
  setProgressSandbox(true);
  bumpProgress({ placements: 5, merges: 2, games_finished: 1 });
  flushProgressNow();
  assert.equal(localStorage.getItem(META_KEY), afterLoad);
  setProgressSandbox(false);
  assert.equal(JSON.parse(afterLoad).stats.placements, 0);
});

test('old save keys stay byte-identical after load and play', () => {
  quietPage();
  const blob = 'A'.repeat(8000);
  const saveRaw = JSON.stringify({ games_finished: 4, best_score: 80, picture: blob, extra_count: 3 });
  const legacy = '{"profile":"keep"}';
  mockStorage({ [SAVE_KEY]: saveRaw, 'player-profile': legacy });
  const writes = [];
  const origSet = localStorage.setItem;
  localStorage.setItem = function (k, v) {
    writes.push(k);
    return origSet.call(localStorage, k, v);
  };
  const origTimeout = global.setTimeout;
  const origNow = Date.now;
  global.setTimeout = (fn, ms) => ({ fn, ms });
  try {
    loadProgress();
    backfillMeta(VERSION);
    bumpProgress({ placements: 1, games_finished: 1 });
    Date.now = () => origNow.call(Date) + 2000;
    flushProgressNow();
    assert.equal(localStorage.getItem(SAVE_KEY), saveRaw);
    assert.equal(localStorage.getItem('player-profile'), legacy);
    assert.ok(writes.every(k => k === META_KEY));
    const rec = JSON.parse(localStorage.getItem(META_KEY));
    assert.equal(rec.stats.games_finished, 5);
    assert.equal(rec.stats.placements, 1);
    assert.equal(rec.stats.best_score, 80);
    assert.equal(rec.version, VERSION);
    assert.equal('picture' in rec.stats, false);
    assert.equal('extra_count' in rec.stats, false);
  } finally {
    global.setTimeout = origTimeout;
    Date.now = origNow;
  }
});

test('top window does not postMessage', () => {
  const messages = [];
  const top = { postMessage() { messages.push(1); } };
  top.parent = top;
  global.window = top;
  global.location = { search: '', origin: 'https://juliangdeveloper.github.io' };
  mockStorage({});
  try {
    metaUpdate('hexasort-party-v2', VERSION, {
      stats: { games_finished: 1 },
      logros: [],
      declared: [{ key: 'games_finished', monotonic: true }]
    });
    assert.equal(messages.length, 0);
    assert.equal(JSON.parse(localStorage.getItem(META_KEY)).version, VERSION);
  } finally {
    delete global.window;
    global.location = { search: '', origin: 'https://juliangdeveloper.github.io' };
  }
});
