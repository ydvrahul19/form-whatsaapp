// Simple server: serves the page + saves/reads history from database.json
// No installs needed. Just run:  node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// ---------- tiny "database" (a JSON file) ----------
function readDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeDb(rows) {
  fs.writeFileSync(DB_FILE, JSON.stringify(rows, null, 2));
}

// ---------- helpers ----------
function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

// ---------- server ----------
const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];

  // Page
  if (req.method === 'GET' && (url === '/' || url === '/index.html')) {
    fs.readFile(path.join(__dirname, 'index.html'), (err, html) => {
      if (err) {
        res.writeHead(500);
        return res.end('index.html not found');
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
    return;
  }

  // Get history (newest first)
  if (req.method === 'GET' && url === '/api/history') {
    return sendJson(res, 200, readDb().slice().reverse());
  }

  // Save a new entry
  if (req.method === 'POST' && url === '/api/submit') {
    try {
      const data = await readBody(req);
      const name = String(data.name || '').trim();
      const customers = Number(data.customers);
      const visitors = Number(data.visitors);
      const notes = String(data.notes || '').trim();

      if (!name) return sendJson(res, 400, { error: 'Name is required' });
      if (!Number.isFinite(customers) || customers < 0)
        return sendJson(res, 400, { error: 'Customers must be a valid number' });
      if (!Number.isFinite(visitors) || visitors < 0)
        return sendJson(res, 400, { error: 'Visitors must be a valid number' });

      const rows = readDb();
      const entry = {
        id: rows.length ? rows[rows.length - 1].id + 1 : 1,
        name,
        customers,
        visitors,
        notes,
        createdAt: new Date().toISOString(),
      };
      rows.push(entry);
      writeDb(rows);
      return sendJson(res, 200, { ok: true, entry });
    } catch (e) {
      return sendJson(res, 400, { error: e.message });
    }
  }

  res.writeHead(404);
  res.end('Not found');
});

// 0.0.0.0 so you can also open it from your phone on the same Wi-Fi
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Running on http://localhost:${PORT}`);
  console.log('Data is saved in database.json');
});
