import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

export async function handleRequest(request) {
  const url = new URL(request.url);
  let pathname = url.pathname;

  if (pathname === '/') pathname = '/index.html';
  if (pathname === '/healthz') {
    return new Response(JSON.stringify({ status: 'ok', version: '1.0.0' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Prevent directory traversal
  const filePath = join(__dirname, pathname);
  if (!filePath.startsWith(__dirname)) {
    return new Response('Forbidden', {
      status: 403,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const ext = extname(filePath).toLowerCase();

  try {
    const data = await readFile(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const headers = { 'content-type': contentType };

    // Fonts and images never change under a content hash — cache them forever.
    if (ext === '.woff2' || ext === '.png' || ext === '.jpg' || ext === '.webp') {
      headers['cache-control'] = 'public, max-age=31536000, immutable';
    }

    return new Response(data, { status: 200, headers });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return new Response('404 Not Found', {
        status: 404,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }
    return new Response('500 Server Error', {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
}

export function createHttpServer() {
  return createServer(async (req, res) => {
    try {
      const request = new Request(`http://${req.headers.host || 'localhost'}${req.url}`, {
        method: req.method,
        headers: req.headers,
      });
      const response = await handleRequest(request);
      res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
      if (response.body) {
        Readable.fromWeb(response.body).on('error', () => res.destroy()).pipe(res);
      } else {
        res.end();
      }
    } catch {
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('500 Internal Error');
    }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const PORT = process.env.PORT || 3000;
  const srv = createHttpServer();
  srv.listen(PORT, () => {
    console.log(`Company site template running at http://localhost:${PORT}`);
  });
}
