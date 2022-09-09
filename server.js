// Server for Hot Reloading Web Pages
//
// This is a simple websocket server
// with two watchers set up.
//
// #1 watches 'test.js' for any changes
// which runs the 'node index' script
// which builds the mockup 'indexNNN.html' files in 'html' based on test.js
//
// #2 watches 'html' folder once those files have been built
// triggering a websocket message to the browser, to request it to refresh
//
// So this server just tells the browser to refresh and show the latest designs automatically!

const chokidar = require("chokidar");
const WebSocket = require("ws");
const { exec } = require("child_process");

chokidar
    .watch("test.js", {
        // pause after a refresh to avoid recursive calling
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
        console.log("ws message sent: html has been updated - please refresh!");
        ws.send("html has been updated - please refresh!");
    });
});
