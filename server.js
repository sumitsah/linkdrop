const http = require('node:http');
const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({ connectionString: config.databaseUrl, max: 5 });

function render(links) {
  const items = links
    .map((l) => `<li><a href="${l.url}">${l.url}</a><p>${l.note}</p><time>${l.created_at.toISOString()}</time>  <span class="category-tag">${l.category || 'others'}</span></li>`)
    .join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>linkdrop</title>
<style>
  body{font:16px/1.5 system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 16px;color:#0f172a}
  form{display:grid;gap:8px;margin-bottom:32px}
  input,textarea,button, select{font:inherit;padding:8px}
  li{margin-bottom:16px}
  li p{margin:4px 0}
  time{color:#64748b;font-size:13px}
  .category-tag {
  display: inline-block;
  padding: 4px 12px;
  font-size: 0.65rem;
  font-weight: 600;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: #d4d0d0;
}
  tag {
  color: #6b21a8;
}
</style>
</head>
<body>
<h1>linkdrop</h1>
<form method="post" action="/links">
  <input name="url" type="url" placeholder="https://..." required>
  <select name="categories" required>
    <option>Select a category</option>
    <option value="tech">Tech</option>
    <option value="news">News</option>
    <option value="design">Design</option>
    <option value="finance">Finance</option>
    <option value="gaming">Gaming</option>
    <option value="others">Others</option>
  </select>

  <textarea name="note" rows="2" placeholder="Why it is worth reading"></textarea>
  <button type="submit">Drop it</button>
</form>
<ol>
${items}
</ol>
</body>
</html>`;
}

async function listLinks() {
  const { rows } = await pool.query(
    'SELECT url, note, category, created_at FROM links ORDER BY created_at LIMIT $1',
    [config.pageSize],
  );
  return rows;
}

async function addLink(url, note, category) {
  await pool.query('INSERT INTO links (url, note, category) VALUES ($1, $2, $3)', [url, note, category]);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 10_000) req.destroy();
    });
    req.on('end', () => resolve(new URLSearchParams(body)));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/healthz') {
      res.writeHead(200, { 'content-type': 'text/plain' });
      return res.end('ok');
    }
    if (req.method === 'GET' && req.url === '/') {
      const links = await listLinks();
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return res.end(render(links));
    }
    if (req.method === 'POST' && req.url === '/links') {
      const form = await readBody(req);
      const category = (form.get('categories') || '').trim();
      const url = (form.get('url') || '').trim();
      const note = (form.get('note') || '').trim();
      if (!url) {
        res.writeHead(400, { 'content-type': 'text/plain' });
        return res.end('A link needs a URL.');
      }
      await addLink(url, note, category);
      res.writeHead(303, { location: '/' });
      return res.end();
    }
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'content-type': 'text/plain' });
    res.end('Something went wrong.');
  }
});

server.listen(config.port, config.host, () => {
  console.log(`linkdrop listening on http://${config.host}:${config.port}`);
});

process.on('SIGTERM', () => {
  server.close(() => pool.end().then(() => process.exit(0)));
});
