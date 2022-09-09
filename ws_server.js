const chokidar = require("chokidar");
const WebSocket = require("ws");
const { exec } = require("child_process");

chokidar
    .watch("test.js", {
        awaitWriteFinish: {
            stabilityThreshold: 200,
            pollInterval: 50,
        },
    })
    .on("change", (event, path) => {
        console.log("test.js was changed");
        exec("node index", (error, stdout, stderr) => {
            if (error) {
                console.log("'node index' error");
                return;
            }
            if (stderr) {
                console.log("File system error");
                return;
            }
        });
    });

const wss = new WebSocket.Server({ port: 8080 });
console.log("ws server started");

wss.on("connection", (ws) => {
    console.log("ws connection from browser");

    chokidar.watch("html").on("change", (event, path) => {
        console.log("html has been updated");
        ws.send("html has been updated - please refresh");
    });
});
