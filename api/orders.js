const db = require('./_database');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const rows = await new Promise((resolve, reject) => {
        db.all(`SELECT * FROM orders ORDER BY created_at DESC`, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      return res.status(200).json(rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    const { items, total } = req.body;
    if (!items || !total) {
      return res.status(400).json({ error: 'Items dan total wajib diisi' });
    }

    const itemsStr = JSON.stringify(items);
    try {
      const result = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO orders (items, total, status) VALUES (?, ?, 'pending')`,
          [itemsStr, total],
          function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID });
          }
        );
      });
      res.status(200).json({ 
        success: true, 
        orderId: result.id,
        message: 'Order berhasil dibuat, bos!' 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
