const { addEntry, persistent } = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST' });
  }

  try {
    let data = req.body || {};
    if (typeof data === 'string') data = JSON.parse(data || '{}');

    const name = String(data.name || '').trim();
    const customers = Number(data.customers);
    const visitors = Number(data.visitors);
    const notes = String(data.notes || '').trim();

    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!Number.isFinite(customers) || customers < 0)
      return res.status(400).json({ error: 'Customers must be a valid number' });
    if (!Number.isFinite(visitors) || visitors < 0)
      return res.status(400).json({ error: 'Visitors must be a valid number' });

    const entry = await addEntry({ name, customers, visitors, notes });
    return res.status(200).json({ ok: true, entry, persistent });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
