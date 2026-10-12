// Tiny database helper using Upstash Redis over plain HTTPS (no npm packages needed).
// Vercel's Upstash integration sets KV_REST_API_URL / KV_REST_API_TOKEN,
// a manual Upstash setup uses UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.
// Both are supported. If neither is set, it falls back to temporary memory
// (history will be lost) so the page still works for a quick test.

const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const persistent = Boolean(URL_ && TOKEN);

// ---- temporary fallback (not saved between requests reliably) ----
const mem = { list: [], id: 0 };

async function redis(command) {
  const res = await fetch(URL_, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || 'Database error');
  return data.result;
}

async function addEntry(fields) {
  const createdAt = new Date().toISOString();
  if (!persistent) {
    const entry = { id: ++mem.id, ...fields, createdAt };
    mem.list.unshift(entry);
    return entry;
  }
  const id = await redis(['INCR', 'entries:id']);
  const entry = { id, ...fields, createdAt };
  await redis(['LPUSH', 'entries', JSON.stringify(entry)]);
  return entry;
}

async function getEntries(limit = 200) {
  if (!persistent) return mem.list.slice(0, limit);
  const rows = await redis(['LRANGE', 'entries', 0, limit - 1]);
  return rows.map((r) => JSON.parse(r));
}

module.exports = { addEntry, getEntries, persistent };
