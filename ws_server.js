const chokidar = require("chokidar");
const { exec } = require("child_process");

chokidar
    .watch("test.js", {
        awaitWriteFinish: {
            stabilityThreshold: 200,
            pollInterval: 50,
        },
    })
    .on("change", (event, path) => {
        console.log("test.js is changed");
        exec("node index", (error, stdout, stderr) => {
            if (error) {
                console.log("Error in running 'node index'");
                return;
            }
            if (stderr) {
                console.log("an error with file system");
                return;
            }
            console.log("Result of 'node index' command output");
        });
    });

const watch_output_html = chokidar.watch("html");

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
console.log("ws server started");
wss.on("connection", (ws) => {
    console.log("ws connection from browser");
    let now = Date.now();

    watch_output_html.on("change", (event, path) => {
        console.log(event, path);
        ws.send("Hello! Message From Server!!");
    });

    ws.on("message", (message) => {
        console.log(`Received message => ${message}`);
        //ws.send("Hello! Message From Server!!");
    });
});
