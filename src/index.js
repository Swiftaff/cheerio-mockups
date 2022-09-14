// Simple websocket Server for Hot Reloading Web Pages
// Builds html files, and tells the browser to refresh and show the latest designs automatically!
//
// Has two watchers set up:
//
// #1 watches input directory for any changes
// which builds the mockup .html files in output directory
//
// #2 watches output directory once those files have been built
// restarting webserver, and triggering a websocket message to the browser, to request it to refresh

const path = require("path");
const fs = require("fs");
const os = require("os");
const chokidar = require("chokidar");
const WebSocket = require("ws");
const { spawn, exec } = require("child_process");
const build = require("./build.js");

module.exports = function (config_filepath = "mockups_config.js") {
    let server;
    let config = [];
    let config_count = 0;
    let options = get_options();
    watch();
    build(options);
    serve();

    function watch() {
        let input_path = path.join(process.cwd(), options.input);
        let input_watcher = chokidar.watch(input_path, options.chokidar.input);
        console.log("input_path", input_path);
        input_watcher.on("change", (event, path) => {
            console.log(`a file in "${options.input}" folder was changed`);
            options = get_options();
            build(options);
            serve();
        });

        const wss = new WebSocket.Server(options.ws);
        console.log("ws_server: started");

        let output_watcher;
        wss.on("connection", (ws) => {
            console.log("ws_server: connection from browser");
            let refreshed = false;
            if (output_watcher) output_watcher.close();
            let output_path = path.join(process.cwd(), options.output);
            output_watcher = chokidar.watch(output_path, options.chokidar.input);
            console.log("output_path", output_path);
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
            console.log(`html_server: started on http://localhost:${options.port}`);
            server = spawn(
                `sirv "${path.join(process.cwd(), options.output)}" --port ${options.port} --dev --quiet`,
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
        }
    }

    function get_options() {
        //const config_txt = fs.readFileSync(path.join(process.cwd(), config_filepath), {
        //    encoding: "utf8",
        //    flag: "r",
        //});
        //const config = JSON.parse(config_txt);
        config_count++;
        config.push({});
        let dodgy = new Array(config_count).fill(["/test", "../"]).flat();
        let path_args = [process.cwd(), dodgy, config_filepath].flat();
        console.log("## get_options", path_args, config[config_count - 1], config_count);
        config[config_count - 1] = require(path.join(...path_args));
        console.log(config_filepath);
        return {
            mockups: [],
            input: "",
            output: "html",
            original: "original.html",
            port: 3000,
            ws: {
                port: 8080,
            },
            chokidar: {
                input: {
                    awaitWriteFinish: {
                        stabilityThreshold: 400,
                        pollInterval: 400,
                    },
                },
                output: {
                    awaitWriteFinish: {
                        stabilityThreshold: 400,
                        pollInterval: 400,
                    },
                },
            },
            ...config[config_count - 1],
        };
    }
};
