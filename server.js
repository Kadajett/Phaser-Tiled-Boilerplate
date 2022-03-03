const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  
  // serve js files from client/src
  if (req.url === "/") {
    res.writeHead(200, { "content-type": "text/html" });
    fs.createReadStream("index.html").pipe(res);
  } else if (req.url === "/script.js") {
    res.writeHead(200, { "content-type": "text/javascript" });
    fs.createReadStream("/public/bundle.js").pipe(res);
  } 
  // serve wildcard images from client/src/assets
  else if (req.url.startsWith("/") && (req.url.endsWith(".png") || req.url.endsWith(".jpg") || req.url.endsWith(".svg"))) {
    res.writeHead(200, { "content-type": "image/png" });
    console.log(req.url);
    fs.createReadStream("client/src/assets" + req.url).pipe(res);
  }
});

server.listen(process.env.PORT || 1337);
