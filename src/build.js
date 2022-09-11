const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

console.log(process.argv);

let options = {
    input: process.argv[2],
    output: process.argv[3],
};
let config = path.join(options.input, "config.js");
console.log("config", options);
const mockup_instructions = require(config);

if (!Array.isArray(mockup_instructions)) {
    mockup_instructions = [mockup_instructions];
}

let filenames = [];

mockup_instructions.forEach((mockup, m) => {
    // get original HTML
    const file_data = fs.readFileSync(path.join(options.output, "original.html"), { encoding: "utf8", flag: "r" });
    let $ = cheerio.load(file_data);

    // inject hot reloader
    const hot_reloader = fs.readFileSync(path.join(__dirname, "browser_hot_reloader.html"), {
        encoding: "utf8",
        flag: "r",
    });
    $("body").append($.html(hot_reloader));

    // Perform instructions for this mockup
    $ = mockup.instructions($, get_template_as_html);

    // Save mockup as html file
    let output_html = $.html();
    //console.log(output_html);
    let filename = mockup.name || "index" + m;
    filenames.push(filename);
    fs.writeFileSync(path.join(options.output, `${filename}.html`), output_html);
});

function get_template_as_html(template_filename) {
    const file_data = fs.readFileSync(path.join(options.input, template_filename), { encoding: "utf8", flag: "r" });
    return file_data;
}
