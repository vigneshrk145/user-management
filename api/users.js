const fs = require('fs');
const path = require('path');

const setCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const parseRequest = (req) => {
  const fullUrl = req.url || '/';
  try {
    const u = new URL(fullUrl, 'http://localhost');
    return u;
  } catch (e) {
    return { pathname: fullUrl, searchParams: new URLSearchParams() };
  }
};

const getBodyBuffer = (req) => {
  return new Promise((resolve, reject) => {
    let chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
};


module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const method = req.method;
  const dbPath = path.join(__dirname, '..', 'db.json');

  try {
    // Ensure db.json exists and is valid JSON
    if (!fs.existsSync(dbPath)) {
      if (method === 'GET') return res.status(200).json([]);
      return res.status(501).json({ message: 'db.json not found in deployment; write operations are not supported.' });
    }

    const raw = fs.readFileSync(dbPath, 'utf-8');
    let db;
    try {
      db = JSON.parse(raw);
    } catch (parseErr) {
      console.error('Failed to parse db.json:', parseErr);
      if (method === 'GET') return res.status(200).json([]);
      return res.status(500).json({ message: 'Invalid db.json format' });
    }

    if (!Array.isArray(db.users)) db.users = [];

    const url = parseRequest(req);
    const pathParts = url.pathname.split('/').filter(Boolean);
    // If path contains an id like /api/users/1
    let idFromPath = null;
    if (pathParts.length > 1) {
      const last = pathParts[pathParts.length - 1];
      const n = Number(last);
      if (!Number.isNaN(n)) idFromPath = n;
    }
    const qid = url.searchParams.get('id');
    const id = idFromPath || (qid ? Number(qid) : null);

    if (method === 'GET') {
      if (id !== null) {
        const found = db.users.find((u) => Number(u.id) === Number(id));
        return res.status(200).json(found || null);
      }
      return res.status(200).json(db.users);
    }

    // For write operations, attempt to update db.json. On many serverless
    // platforms the filesystem is read-only or ephemeral; if writing fails
    // we return 501 with an explanation so the frontend knows writes won't persist.
    if (method === 'POST') {
      try {
        const body = await getBodyBuffer(req);
        const payload = body ? JSON.parse(body) : {};
        const maxId = db.users.reduce((m, u) => Math.max(m, Number(u.id) || 0), 0);
        const newUser = { ...payload, id: (maxId || 0) + 1 };
        db.users.push(newUser);
        try {
          fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
          return res.status(201).json(newUser);
        } catch (writeErr) {
          console.error('Write failed:', writeErr);
          return res.status(501).json({ message: 'Write operations are not supported on this deployment (filesystem read-only). Use an external backend for persistence.' });
        }
      } catch (parseErr) {
        console.error('POST parse error:', parseErr);
        return res.status(400).json({ message: 'Invalid request body' });
      }
    }

    if (method === 'PUT') {
      try {
        const body = await getBodyBuffer(req);
        const payload = body ? JSON.parse(body) : {};
        if (id === null) return res.status(400).json({ message: 'Missing id for update' });
        const idx = db.users.findIndex((u) => Number(u.id) === Number(id));
        if (idx === -1) return res.status(404).json({ message: 'User not found' });
        db.users[idx] = { ...db.users[idx], ...payload, id: db.users[idx].id };
        try {
          fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
          return res.status(200).json(db.users[idx]);
        } catch (writeErr) {
          console.error('Write failed:', writeErr);
          return res.status(501).json({ message: 'Write operations are not supported on this deployment (filesystem read-only).' });
        }
      } catch (parseErr) {
        console.error('PUT parse error:', parseErr);
        return res.status(400).json({ message: 'Invalid request body' });
      }
    }

    if (method === 'DELETE') {
      if (id === null) return res.status(400).json({ message: 'Missing id for delete' });
      const idx = db.users.findIndex((u) => Number(u.id) === Number(id));
      if (idx === -1) return res.status(404).json({ message: 'User not found' });
      const removed = db.users.splice(idx, 1)[0];
      try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
        return res.status(200).json(removed);
      } catch (writeErr) {
        console.error('Write failed:', writeErr);
        return res.status(501).json({ message: 'Delete not supported on this deployment (filesystem read-only).' });
      }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};
