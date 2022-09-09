// Server for Hot Reloading Web Pages
//
// This is a simple websocket server
// with two watchers set up.
//
// #1 watches 'test.js' for any changes
// which runs the 'node src/build' script
// which builds the mockup 'indexNNN.html' files in 'html' based on test.js
//
// #2 watches 'html' folder once those files have been built
// triggering a websocket message to the browser, to request it to refresh
//
// So this server just tells the browser to refresh and show the latest designs automatically!

const chokidar = require("chokidar");
const WebSocket = require("ws");
const { spawn } = require("child_process");
const command = "node src/build";
let server;
//serve();

const pause_after_refresh = {
    // pause after a refresh to avoid recursive calling
    awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100,
    },
};

chokidar.watch("./src", pause_after_refresh).on("change", (event, path) => {
    console.log("a file in 'src' folder was changed");
    spawn(
        command,
        {
            stdio: ["ignore", "inherit", "inherit"],
            shell: true,
        },
        (error, stdout, stderr) => {
            if (error) {
                console.log(`'${command}' error: ${error}`);
                return;
            }
            if (stderr) {
                console.log(`File system error: ${stderr}`);
                return;
            }
            console.log(stdout);
        }
    );

    //serve();
});

const wss = new WebSocket.Server({ port: 8080 });
console.log("ws server started");

let watcher;
wss.on("connection", (ws) => {
    console.log("ws connection from browser");
    let refreshed = false;
    if (watcher) watcher.close();
    watcher = chokidar.watch("./html", pause_after_refresh);
    watcher.on("change", (event, path) => {
        console.log("ws message sent: html has been updated - please refresh!");
        if (!refreshed) ws.send("html has been updated - please refresh!");
        refreshed = true;
    });
});

function serve() {
    function toExit() {
        if (server) server.kill(0);
    }

    toExit();
    server = require("child_process").spawn("npm", ["run", "manually_start_html_server"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
    });

    process.on("SIGTERM", toExit);
    process.on("exit", toExit);
}
