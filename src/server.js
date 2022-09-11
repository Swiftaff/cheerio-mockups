// Simple websocker Server for Hot Reloading Web Pages
// Builds html files, and tells the browser to refresh and show the latest designs automatically!
//
// Has two watchers set up:
//
// #1 watches 'test.js' for any changes
// which runs the 'node src/build' script
// which builds the mockup .html files in 'html' based on `mockups.js`
//
// #2 watches 'html' folder once those files have been built
// restarting webserver, and triggering a websocket message to the browser, to request it to refresh

os = require("os");
const chokidar = require("chokidar");
const WebSocket = require("ws");
const { spawn, exec } = require("child_process");

console.log("args", process.argv);

let server;
serve();

const pause_after_refresh = {
    // pause after a refresh to avoid recursive calling
    awaitWriteFinish: {
        stabilityThreshold: 400,
        pollInterval: 400,
    },
};

chokidar.watch("./src", pause_after_refresh).on("change", (event, path) => {
    console.log("a file in 'src' folder was changed");
    exec(
        "node src/build",
        {
            stdio: ["ignore", "inherit", "inherit"],
            shell: true,
        },
        (error, stdout, stderr) => {
            if (error) {
                console.log(`build: error: ${error}`);
                return;
            }
            if (stderr) {
                console.log(`File system error: ${stderr}`);
                return;
            }
            if (stdout) {
                console.log(stdout);
            }
            serve();
        }
    );
});

const wss = new WebSocket.Server({ port: 8080 });
console.log("ws_server: started");

let watcher;
wss.on("connection", (ws) => {
    console.log("ws_server: connection from browser");
    let refreshed = false;
    if (watcher) watcher.close();
    watcher = chokidar.watch("./html", pause_after_refresh);
    watcher.on("change", (event, path) => {
        setTimeout(() => {
            console.log("ws_server: html has been updated: " + event);
            if (!refreshed) ws.send("html has been updated - please refresh!");
            refreshed = true;
        }, 500); //wait to allow pages to be regenerated
    });
});

function serve() {
    if (server) {
        console.log("html_server: restarting...");
        if (os.platform() === "win32") {
            exec(
                "taskkill /pid " + server.pid + " /T /F",
                {
                    stdio: ["ignore", "inherit", "inherit"],
                    shell: true,
                },
                (error, stdout, stderr) => {
                    if (error) {
                        console.log(`taskkill error: ${error}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`File system error: ${stderr}`);
                        return;
                    }
                    if (stdout) {
                        //console.log(stdout);
                    }
                }
            );
            server = null;
        } else {
            server.kill(0);
        }

        setTimeout(() => {
            serve();
        }, 1000);
    } else {
        console.log();
        console.log("html_server: started on http://localhost:3000");
        server = spawn(
            "sirv html --port 3000 --dev --quiet",
            {
                stdio: ["ignore", "inherit", "inherit"],
                shell: true,
            },
            (error, stdout, stderr) => {
                if (error) {
                    console.log(`sirv error: ${error}`);
                    return;
                }
                if (stderr) {
                    console.log(`File system error: ${stderr}`);
                    return;
                }
                if (stdout) {
                    console.log(stdout);
                }
            }
        );
        //server.on("SIGTERM", () => console.log("html_server: sigterm"));
        //server.on("close", () => console.log("html_server: closed"));
        //server.on("exit", () => console.log("html_server: exited"));
    }
}
