const cheerio = require("cheerio");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const browser_hot_reloader = require("./html_browser_hot_reloader.js");
const bootstrap_markup = require("./bootstrap_markup.js");

let options = {
    input: process.argv[2],
    output: process.argv[3],
    config_path: process.argv[4],
    original: process.argv[5],
};

const config = require(options.config_path);

let mockups = config.mockups;
if (!Array.isArray(mockups)) {
    mockups = [mockups];
}

let filenames = [];

mockups.forEach((mockup, m) => {
    // get original HTML
    const file_data = fs.readFileSync(path.join(options.output, options.original), {
        encoding: "utf8",
        flag: "r",
    });
    let $ = cheerio.load(file_data);

    // inject hot reloader
    $("body").append($.html(browser_hot_reloader));

    // Perform instructions for this mockup
    $ = mockup.instructions($, get_template_as_html, get_template_as_yaml_bootstrap);

    // Save mockup as html file
    let output_html = $.html();
    //console.log(output_html);
    let filename = mockup.name || "index" + m;
    filenames.push(filename);
    fs.writeFileSync(path.join(options.output, `${filename}.html`), output_html);
});

function get_template_as_html(template_filename) {
    const file_data = fs.readFileSync(path.join(options.input, template_filename), {
        encoding: "utf8",
        flag: "r",
    });
    return file_data;
}

function get_template_as_yaml_bootstrap(template_filename) {
    console.log("yaml");
    let file_data = "";
    try {
        const doc = yaml.load(fs.readFileSync(path.join(options.input, template_filename), "utf8"));
        console.log("yaml - success");
        console.log(doc);
        file_data = bootstrap_parser(doc);
    } catch (e) {
        console.log("yaml - error");
        console.log(e);
    }

    return file_data;
}

function bootstrap_parser(doc, input = "") {
    let output = input;
    for (const key in doc) {
        if (Object.hasOwnProperty.call(doc, key)) {
            const element = doc[key];
            console.log(key, element);
            output = output + bootstrap_markup(element);
        }
    }
    return output;
}
