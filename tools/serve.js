// Minimal zero-dependency static server for the Solutions Castle site.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }

  const serveStream = (targetFile) => {
    res.writeHead(200, {
      'content-type': MIME[path.extname(targetFile).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-cache'
    });
    fs.createReadStream(targetFile).pipe(res);
  };

  fs.stat(file, (err, st) => {
    if (!err && st.isFile()) {
      serveStream(file);
      return;
    }
    if (!err && st.isDirectory()) {
      const idx = path.join(file, 'index.html');
      fs.stat(idx, (iErr, iSt) => {
        if (!iErr && iSt.isFile()) {
          serveStream(idx);
        } else {
          res.writeHead(404, { 'content-type': 'text/plain' }).end('404');
        }
      });
      return;
    }
    if (path.extname(file) === '') {
      const htmlFile = file + '.html';
      fs.stat(htmlFile, (hErr, hSt) => {
        if (!hErr && hSt.isFile()) {
          serveStream(htmlFile);
        } else {
          res.writeHead(404, { 'content-type': 'text/plain' }).end('404');
        }
      });
      return;
    }
    res.writeHead(404, { 'content-type': 'text/plain' }).end('404');
  });
}).listen(PORT, '0.0.0.0', () => console.log('serving ' + ROOT + ' on 0.0.0.0:' + PORT));
