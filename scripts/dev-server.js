// Zero-dependency static file server for local sanity-checking the PWA skeleton.
// Not part of the app; not deployed. Run with: node scripts/dev-server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const port = 8080;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/manifest+json',
  '.png': 'image/png',
};

http
  .createServer((req, res) => {
    let filePath = path.join(root, req.url === '/' ? '/index.html' : req.url);
    const ext = path.extname(filePath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(data);
    });
  })
  .listen(port, () => console.log(`serving ${root} at http://localhost:${port}`));
