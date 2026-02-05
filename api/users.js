const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const method = req.method;
  const dbPath = path.join(__dirname, '..', 'db.json');

  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(raw);
    const users = db.users || [];

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
