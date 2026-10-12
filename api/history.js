const { getEntries, persistent } = require('./_db');

module.exports = async (req, res) => {
  try {
    const rows = await getEntries();
    res.setHeader('Cache-Control', 'no-store');
    // Header tells the page whether data is really being saved
    res.setHeader('X-Persistent', persistent ? '1' : '0');
    return res.status(200).json(rows);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
