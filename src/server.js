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

const path = require("path");
const os = require("os");
const chokidar = require("chokidar");
const WebSocket = require("ws");
const { spawn, exec } = require("child_process");

const chokidar_settings = {
    // pause after a refresh to avoid recursive calling
    awaitWriteFinish: {
        stabilityThreshold: 400,
        pollInterval: 400,
    },
};

console.log("args", process.argv);

let options = {
    input: path.join(__dirname, process.argv[2] || ""),
    output: path.join(__dirname, "../html"),
    port: 3000,
    ws: {
        port: 8080,
    },
    chokidar: {
        input: chokidar_settings,
        output: chokidar_settings,
    },
};

console.log(options);

let server;
watch();
build();
serve();

function watch() {
    let input_chokidar = chokidar.watch(options.input, options.chokidar.input);
    input_chokidar.on("change", (event, path) => {
        console.log(`a file in "${options.input}" folder was changed`);
        build();
    });

    const wss = new WebSocket.Server(options.ws);
    console.log("ws_server: started");

    let output_watcher;
    wss.on("connection", (ws) => {
        console.log("ws_server: connection from browser");
        let refreshed = false;
        if (output_watcher) output_watcher.close();
        output_watcher = chokidar.watch(options.output, options.chokidar.input);
        output_watcher.on("change", (event, _path) => {
            setTimeout(() => {
                console.log("ws_server: html has been updated: " + event);
                if (!refreshed) ws.send("html has been updated - please refresh!");
                refreshed = true;
            }, 500); //wait to allow pages to be regenerated
        });
    });
}

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
        console.log("---------------------------------------------");
        console.log("html_server: started on http://localhost:3000");
        server = spawn(
            `sirv "${options.output}" --port ${options.port} --dev --quiet`,
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

function build() {
    exec(
        `node src/build ${options.input} ${options.output}`,
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
}
