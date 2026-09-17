const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.pdf':'application/pdf'};
http.createServer((req,res) => {
  let filename;
  try {
    filename = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (filename !== root && !filename.startsWith(root + path.sep)) throw Error('Invalid path');
    if (fs.statSync(filename).isDirectory()) filename=path.join(filename,'index.html');
    res.writeHead(200, {'Content-Type':types[path.extname(filename)] || 'application/octet-stream'});
    fs.createReadStream(filename).pipe(res);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(8000, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:8000'));
