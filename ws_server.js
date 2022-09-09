const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
console.log("ws server started");
wss.on("connection", (ws) => {
    console.log("ws connection");
    ws.on("message", (message) => {
        console.log(`Received message => ${message}`);
    });
    ws.send("Hello! Message From Server!!");
});
