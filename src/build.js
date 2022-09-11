const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

console.log(process.argv);

let options = {
    input: process.argv[2],
    output: process.argv[3],
};

const mockup_instructions = require(path.join(options.input, "config.js"));

if (!Array.isArray(mockup_instructions)) {
    mockup_instructions = [mockup_instructions];
}

let filenames = [];

mockup_instructions.forEach((mockup, m) => {
    // get original HTML
    const file_data = fs.readFileSync(path.join(options.output, "original.html"), { encoding: "utf8", flag: "r" });
    let $ = cheerio.load(file_data);

    // inject hot reloader
    const hot_reloader = fs.readFileSync(path.join(options.input, "browser_hot_reloader.html"), {
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
