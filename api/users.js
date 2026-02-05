const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const method = req.method;
  const dbPath = path.join(__dirname, '..', 'db.json');

  try {
    if (!fs.existsSync(dbPath)) {
      // If db.json is not present in the deployment, return an empty list
      // instead of throwing a 500. This avoids failures when read-only
      // environments don't include the file.
      if (method === 'GET') return res.status(200).json([]);
      return res.status(501).json({ message: 'Write operations are not supported in this demo function.' });
    }

    const raw = fs.readFileSync(dbPath, 'utf-8');
    let db;
    try {
      db = JSON.parse(raw);
    } catch (parseErr) {
      console.error('Failed to parse db.json:', parseErr);
      // Return empty users rather than failing completely
      if (method === 'GET') return res.status(200).json([]);
      return res.status(500).json({ message: 'Invalid db.json format' });
    }

    const users = Array.isArray(db.users) ? db.users : [];

    if (method === 'GET') {
      return res.status(200).json(users);
    }

    // For write operations (POST/PUT/DELETE) we return 501 Not Implemented
    // because serverless filesystem is ephemeral and writes won't persist.
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      return res.status(501).json({ message: 'Write operations are not supported in this demo function. Use a real backend for persistence.' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
