const app = require("./app");
const http = require("http");
const hostname = "127.0.0.1" || "0.0.0.0";
const port = 3000;

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
