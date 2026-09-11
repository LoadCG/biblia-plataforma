const fs = require("fs");
const http = require("http");
const path = require("path");

const raiz = path.resolve(process.argv[2] || "dist");
const porta = Number(process.argv[3] || 8092);
const tipos = { ".css": "text/css", ".html": "text/html", ".ico": "image/x-icon", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };

function resolverDestino(url) {
  const pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
  const relativo = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
  const candidatos = [relativo, `${relativo}.html`, path.join(relativo, "index.html")];
  for (const candidato of candidatos) {
    const destino = path.resolve(raiz, candidato);
    if (destino.startsWith(`${raiz}${path.sep}`) && fs.existsSync(destino) && fs.statSync(destino).isFile()) return destino;
  }
  if (pathname.startsWith("/biblia/")) return path.join(raiz, "index.html");
  return path.join(raiz, "+not-found.html");
}

http.createServer((req, res) => {
  const destino = resolverDestino(req.url || "/");
  const status = destino.endsWith("+not-found.html") ? 404 : 200;
  res.writeHead(status, { "Content-Type": `${tipos[path.extname(destino)] || "application/octet-stream"}; charset=utf-8` });
  fs.createReadStream(destino).pipe(res);
}).listen(porta, "127.0.0.1", () => console.log(`Export estático disponível em http://127.0.0.1:${porta}`));
