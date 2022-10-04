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

// get index_template
const index_file_data = fs.readFileSync(path.join(__dirname, "/index_template.html"), {
    encoding: "utf8",
    flag: "r",
});
let $index = cheerio.load(index_file_data);
// inject hot reloader
$index("body").append($index.html(browser_hot_reloader));

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
    fs.writeFileSync(path.join(options.output, `${filename}.html`), output_html);

    // insert link to this mockup into the index
    $index("#nav").append(`<a href="#${mockup.name}">${mockup.name}</a> | `);
    $index("#main").append(
        `<a name="${mockup.name}" href="${filename}">${mockup.name}</a><iframe style="width:calc(100% - 10px); height:calc(100vh - 150px);" src="${filename}"></iframe>`
    );
});

$index("#main").append("<p>&nbsp;</p>");

// Save index as html file
let output_html = $index.html();
fs.writeFileSync(path.join(options.output, `index.html`), output_html);

function get_template_as_html(template_filename) {
    const file_data = fs.readFileSync(path.join(options.input, template_filename), {
        encoding: "utf8",
        flag: "r",
    });
    return file_data;
}

function get_template_as_yaml_bootstrap(template_filename) {
    //console.log("yaml");
    let file_data = "";
    try {
        const doc = yaml.load(fs.readFileSync(path.join(options.input, template_filename), "utf8"));
        //console.log("yaml - success");
        //console.log(doc);
        //console.log();
        file_data = bootstrap_parser(doc);
    } catch (e) {
        //console.log("yaml - error");
        console.log(e);
    }
    //console.log(file_data);
    return file_data;
}

function bootstrap_parser(doc, input = "") {
    let output = input;
    for (const key in doc) {
        if (Object.hasOwnProperty.call(doc, key)) {
            const element = doc[key];
            //console.log();
            //console.log(key, element, typeof element);
            if (key === "text") console.log("!!!key = string", key);
            if (typeof element === "object") {
                //console.log("element = object", element);
                let not_an_index = isNaN(parseInt(key));
                //console.log(not_an_index, key);
                if (not_an_index) output = output + bootstrap_markup(key, "start");
                output = bootstrap_parser(element, output);
                if (not_an_index) output = output + bootstrap_markup(key, "end");
            } else {
                //console.log("element = string", element);

                let not_an_index = isNaN(parseInt(key));
                //console.log(not_an_index, key);
                if (not_an_index) {
                    output = output + bootstrap_markup(key, null, element);
                } else {
                    output = output + bootstrap_markup(element);
                }

                //if (not_an_index) output = output + bootstrap_markup(key, "end");
            }
        }
    }
    return output;
}
