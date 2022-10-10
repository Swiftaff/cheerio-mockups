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

module.exports = function () {
    let server;
    let config_path = path.join(path.dirname(process.argv[1]), "mockups_config.js");
    if (!fs.existsSync(config_path)) {
        config_path = path.join(path.dirname(process.argv[1]), "mockups_config.json");
        if (!fs.existsSync(config_path)) {
            console.error(
                "No config file found - need either a mockups_config.js (with module.exports) or mockups_config.json"
            );
        }
    }
    let options = get_options();
    let input_path = path.dirname(process.argv[1]);
    let output_path = path.join(process.cwd(), options.output);
    let src_path = path.join(process.cwd(), "/src");
    let first_watched_file_was_updated = false;
    watch();
    build();
    serve();

    function watch() {
        let input_watcher = chokidar.watch(input_path, options.chokidar.input);
        console.log("input_path", input_path);
        input_watcher.on("change", (event, path) => {
            console.log(`a file in "${options.input}" folder was changed`);
            build();
            serve();
        });

        let src_watcher = chokidar.watch(src_path, options.chokidar.src);
        console.log("src_path", src_path);
        src_watcher.on("change", (event, path) => {
            console.log(`a file in "cheerio-mockups/src" folder was changed`);
            build();
            serve();
        });

        const wss = new WebSocket.Server(options.ws);
        console.log("ws_server: started");

        let output_watcher;
        wss.on("connection", (ws, request) => {
            console.log("ws_server: connection from browser"); //, Object.keys(request), request.headers);
            ws.on("message", (data) => {
                const str = new TextDecoder().decode(data);
                let obj = JSON.parse(str);
                if (obj && obj.action) {
                    const config = load_config_file(config_path);
                    switch (obj.action) {
                        case "new":
                            //NEW PAGE
                            config.mockups.push({
                                name: obj.name,
                                instructions: [],
                            });
                            save_config_file(config, config_path);
                            break;
                        case "remove":
                            //ADD 'REMOVE ELEMENT' to list of instructions
                            //get page_name
                            let split = obj.url.split("/");
                            let page_name = split[split.length - 1];
                            //insert instruction
                            config.mockups.map((m) => {
                                if (m.name === page_name) {
                                    if (!m.instructions) m.instructions = [];
                                    //create new instruction
                                    let instruction = {
                                        action: "remove",
                                        selector: obj.selector,
                                    };
                                    if (obj.index) instruction.index = obj.index;
                                    m.instructions.push(instruction);
                                }
                                return m;
                            });
                            save_config_file(config, config_path);
                        case "requesting_config":
                            ws.send(JSON.stringify({ action: "sending_config", config }));
                        default:
                            //SCREENSHOT
                            console.log("screenshot", obj.name);
                            setTimeout(() => {
                                ws.send(JSON.stringify({ action: "screenshots_finished" }));
                            }, 2000);
                            break;
                    }
                }
            });
        });
        if (output_watcher) output_watcher.close();
        output_watcher = chokidar.watch(output_path, options.chokidar.input);
        output_watcher.on("change", (event, _path) => {
            setTimeout(() => {
                console.log("ws_server: html has been updated: " + event);
                // only send a refresh message for the first changed file, to avoid multiple refreshes
                if (!first_watched_file_was_updated) {
                    first_watched_file_was_updated = true;
                    wss.clients.forEach(function each(client) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({ action: "refresh" }));
                        }
                    });
                    setTimeout(() => {
                        first_watched_file_was_updated = false;
                        console.log("ws_server: reset first_watched_file_was_updated");
                    }, 2000);
                }
            }, 500); //wait to allow pages to be regenerated
        });
    }

    function toJSONString(input) {
        let input_without_module_exports = input.slice(17, input.length);
        let split = input_without_module_exports.split(";");
        let input_without_last_semicolon = split.slice(0, split.length - 1).join(";");

        const keyMatcher = '([^",{}\\s]+?)';
        const valMatcher = "(.,*)";
        const matcher = new RegExp(`${keyMatcher}\\s*:\\s*${valMatcher}`, "g");
        const parser = (match, key, value) => `"${key}":${value}`;
        return input_without_last_semicolon.replace(matcher, parser);
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

    function load_config_file(config_path) {
        let is_js_file = config_path.slice(-3) === ".js"; //otherwise is_json_file
        const config_data = fs.readFileSync(config_path, {
            encoding: "utf8",
            flag: "r",
        });
        const config_data_only = is_js_file ? toJSONString(config_data) : config_data;
        return JSON.parse(config_data_only);
    }

    function save_config_file(config, config_path) {
        let is_js_file = config_path.slice(-3) === ".js"; //otherwise is_json_file
        const output_code = JSON.stringify(config);
        const output_code_module = is_js_file ? `module.exports = ${output_code};` : output_code;
        fs.writeFileSync(config_path, output_code_module);
    }

    function get_options() {
        const config = load_config_file(config_path);
        return {
            mockups: [],
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
                src: {
                    awaitWriteFinish: {
                        stabilityThreshold: 400,
                        pollInterval: 400,
                    },
                },
            },
            ...config,
        };
    }

    function build() {
        let build_path = "node_modules/cheerio-mockups/src/build.js";
        let build_path_exists = fs.existsSync(build_path);
        if (!build_path_exists) {
            //then probably calling this from example folder inside the module - in which case change path
            build_path = "src/build.js";
        }
        exec(
            `node ${build_path} ${input_path} ${output_path} ${config_path} ${options.original}`,
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
            }
        );
    }
};
