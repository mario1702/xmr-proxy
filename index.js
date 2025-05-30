const net = require("net");
const http = require("http");
const WebSocket = require("ws");

const poolHost = "pool.supportxmr.com";
const poolPort = 3333;

const server = http.createServer();

const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
  const poolSocket = new net.Socket();

  poolSocket.connect(poolPort, poolHost, () => {
    console.log("Connected to SupportXMR pool");
  });

  poolSocket.on("data", data => {
    ws.send(data);
  });

  ws.on("message", message => {
    poolSocket.write(message);
  });

  ws.on("close", () => {
    poolSocket.end();
  });

  poolSocket.on("close", () => {
    ws.close();
  });

  poolSocket.on("error", err => {
    console.error("Pool socket error:", err);
    ws.close();
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
