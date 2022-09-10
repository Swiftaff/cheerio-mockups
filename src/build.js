const cheerio = require("cheerio");
const fs = require("fs");

const mockup_instructions = require("./mockups.js");

if (!Array.isArray(mockup_instructions)) {
    mockup_instructions = [mockup_instructions];
}

let filenames = [];

mockup_instructions.forEach((mockup, m) => {
    // get original HTML
    const file_data = fs.readFileSync("html/original.html", { encoding: "utf8", flag: "r" });
    let $ = cheerio.load(file_data);

    // inject hot reloader
    const hot_reloader = fs.readFileSync("src/browser_hot_reloader.html", { encoding: "utf8", flag: "r" });
    $("body").append($.html(hot_reloader));

    // Perform instructions for this mockup
    $ = mockup.instructions($, get_template_as_html);

    // Save mockup as html file
    let output_html = $.html();
    //console.log(output_html);
    let filename = mockup.name || "index" + m;
    filenames.push(filename);
    fs.writeFileSync(`html/${filename}.html`, output_html);
});

function get_template_as_html(template_filename) {
    console.log("get_template_as_html", template_filename);
    const file_data = fs.readFileSync(`src/${template_filename}`, { encoding: "utf8", flag: "r" });
    return file_data;
}
