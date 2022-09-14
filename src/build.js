const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const browser_hot_reloader = require("./html_browser_hot_reloader.js");

function build(options) {
    let mockups = options.mockups;
    if (!Array.isArray(mockups)) {
        mockups = [mockups];
    }

    let filenames = [];

    mockups.forEach((mockup, m) => {
        // get original HTML
        const file_data = fs.readFileSync(path.join(process.cwd(), options.output, options.original), {
            encoding: "utf8",
            flag: "r",
        });
        let $ = cheerio.load(file_data);

        // inject hot reloader
        $("body").append($.html(browser_hot_reloader));

        // Perform instructions for this mockup
        $ = mockup.instructions($, get_template_as_html);

        // Save mockup as html file
        let output_html = $.html();
        //console.log(output_html);
        let filename = mockup.name || "index" + m;
        filenames.push(filename);
        fs.writeFileSync(path.join(process.cwd(), options.output, `${filename}.html`), output_html);
    });

    function get_template_as_html(template_filename) {
        const file_data = fs.readFileSync(path.join(process.cwd(), options.input, template_filename), {
            encoding: "utf8",
            flag: "r",
        });
        return file_data;
    }
}
module.exports = build;
