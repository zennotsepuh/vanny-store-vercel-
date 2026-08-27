const db = require('./_database');

module.exports = async (req, res) => {
  // Set CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM products`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
