const test = require('node:test');
const assert = require('node:assert/strict');
const { metaUpdate } = require('../meta.js');
const {
  SAVE_KEY,
  META_KEY,
  STAT_KEYS,
  loadProgress,
  backfillMeta,
  bumpProgress
} = require('../progress.js');

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

test('old save without meta.v1 builds the record once', () => {
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
  withNow('2026-10-23T18:00:00.000Z', () => backfillMeta('v1.4.0'));

  assert.equal(localStorage.getItem(SAVE_KEY), saveRaw);
  const rec = JSON.parse(localStorage.getItem(META_KEY));
  assert.deepEqual(Object.keys(rec), ['v', 'slug', 'version', 'updatedAt', 'stats', 'logros', 'hitos']);
  assert.equal(rec.v, 1);
  assert.equal(rec.slug, 'hexasort-party-v2');
  assert.equal(rec.version, 'v1.4.0');
  assert.equal(rec.updatedAt, '2026-10-23T18:00:00.000Z');
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
  assert.equal(rec.stats.extra_count, 4);
  assert.equal('kept_flag' in rec.stats, false);
  assert.deepEqual(rec.logros, ['first_cascade', 'first_clear', 'first_game', 'score_100', 'tutorial_done']);
  assert.deepEqual(Object.keys(rec.hitos).sort(), rec.logros);
  for (const id of rec.logros) assert.equal(rec.hitos[id], '2026-10-23T18:00:00.000Z');
  assert.equal(Object.keys(rec.stats).length, STAT_KEYS.length + 1);
  assert.ok(Object.keys(rec.stats).length <= 20);

  const written = localStorage.getItem(META_KEY);
  backfillMeta('v9.9.9');
  assert.equal(localStorage.getItem(META_KEY), written);
  assert.equal(localStorage.getItem(SAVE_KEY), saveRaw);
});

test('existing meta record is not overwritten by backfill', () => {
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
  backfillMeta('v1.4.0');
  assert.equal(localStorage.getItem(META_KEY), metaRaw);
  assert.equal(localStorage.getItem(SAVE_KEY), saveRaw);
});

test('corrupt JSON does not crash or replace an existing meta value', () => {
  mockStorage({ [META_KEY]: '{nope', [SAVE_KEY]: '{also-bad' });
  assert.doesNotThrow(() => {
    loadProgress();
    backfillMeta('v1.4.0');
  });
  assert.equal(localStorage.getItem(META_KEY), '{nope');
  assert.equal(localStorage.getItem(SAVE_KEY), '{also-bad');
  assert.doesNotThrow(() => metaUpdate('hexasort-party-v2', 'v1.4.0', {
    stats: { games_finished: 1, best_score: NaN },
    logros: ['first_game']
  }));
  const rec = JSON.parse(localStorage.getItem(META_KEY));
  assert.equal(rec.v, 1);
  assert.equal(rec.stats.games_finished, 1);
  assert.equal('best_score' in rec.stats, false);
  assert.deepEqual(rec.logros, ['first_game']);
  assert.equal(typeof rec.hitos.first_game, 'string');
});

test('metaUpdate keeps hitos, unions logros, and posts to the parent', () => {
  const messages = [];
  const frame = {
    parent: {
      postMessage(data, origin) { messages.push({ data, origin }); }
    }
  };
  global.window = frame;
  global.location = { origin: 'https://juliangdeveloper.github.io' };
  mockStorage({
    [META_KEY]: JSON.stringify({
      v: 1,
      slug: 'hexasort-party-v2',
      version: 'v1.3.2',
      updatedAt: '2020-01-01T00:00:00.000Z',
      stats: { games_finished: 1, best_score: 10 },
      logros: ['first_game'],
      hitos: { first_game: '2020-01-01T00:00:00.000Z' }
    })
  });
  try {
    withNow('2026-10-23T18:00:00.000Z', () => {
      metaUpdate('hexasort-party-v2', 'v1.4.0', {
        stats: { games_finished: 2, best_score: NaN, label: 'no', inf: Infinity },
        logros: ['score_100', 'first_game', 'score_100']
      });
    });
    const rec = JSON.parse(localStorage.getItem(META_KEY));
    assert.equal(rec.hitos.first_game, '2020-01-01T00:00:00.000Z');
    assert.equal(rec.hitos.score_100, '2026-10-23T18:00:00.000Z');
    assert.deepEqual(rec.logros, ['first_game', 'score_100']);
    assert.equal(rec.stats.games_finished, 2);
    assert.equal(rec.stats.best_score, 10);
    assert.equal('label' in rec.stats, false);
    assert.equal('inf' in rec.stats, false);
    assert.equal(rec.version, 'v1.4.0');
    assert.equal(rec.updatedAt, '2026-10-23T18:00:00.000Z');
    assert.equal(messages.length, 1);
    assert.equal(messages[0].origin, 'https://juliangdeveloper.github.io');
    assert.deepEqual(messages[0].data.type, 'meta');
    assert.equal(messages[0].data.key, 'meta.v1.hexasort-party-v2');
    assert.equal(messages[0].data.data.slug, 'hexasort-party-v2');
  } finally {
    delete global.window;
    delete global.location;
  }
});

test('metaUpdate writes at most 20 stats and skips postMessage at the top window', () => {
  const messages = [];
  const top = {
    postMessage(data, origin) { messages.push({ data, origin }); }
  };
  top.parent = top;
  global.window = top;
  global.location = { origin: 'https://juliangdeveloper.github.io' };
  mockStorage({});
  try {
    const stats = {};
    for (let i = 0; i < 25; i++) stats['s_' + String(i).padStart(2, '0')] = i;
    metaUpdate('hexasort-party-v2', 'v1.4.0', { stats, logros: [] });
    const rec = JSON.parse(localStorage.getItem(META_KEY));
    assert.equal(Object.keys(rec.stats).length, 20);
    assert.equal(rec.stats.s_00, 0);
    assert.equal(rec.stats.s_19, 19);
    assert.equal('s_20' in rec.stats, false);
    assert.deepEqual(rec.logros, []);
    assert.deepEqual(rec.hitos, {});
    assert.equal(messages.length, 0);
  } finally {
    delete global.window;
    delete global.location;
  }
});

test('progress writes are debounced to one per second', () => {
  mockStorage({});
  delete global.window;
  loadProgress();
  backfillMeta('v1.4.0');
  const afterBackfill = localStorage.getItem(META_KEY);
  const timers = [];
  const origTimeout = global.setTimeout;
  const origNow = Date.now;
  const start = origNow.call(Date);
  Date.now = () => start;
  global.setTimeout = (fn, ms) => {
    const id = timers.length + 1;
    timers.push({ id, fn, ms });
    return id;
  };
  try {
    bumpProgress({ placements: 1 });
    bumpProgress({ placements: 1, merges: 1 });
    assert.equal(timers.length, 1);
    assert.ok(timers[0].ms > 0 && timers[0].ms <= 1000);
    assert.equal(localStorage.getItem(META_KEY), afterBackfill);
    Date.now = () => start + 1000;
    timers[0].fn();
    const rec = JSON.parse(localStorage.getItem(META_KEY));
    assert.equal(rec.stats.placements, 2);
    assert.equal(rec.stats.merges, 1);
    assert.equal(rec.version, 'v1.4.0');
    assert.equal(timers.length, 1);
  } finally {
    global.setTimeout = origTimeout;
    Date.now = origNow;
  }
});
