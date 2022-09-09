const cheerio = require("cheerio");
const fs = require("fs");

const hot_reloader = require("./browser_hot_reloader.js");
console.log(hot_reloader);

const mockup_instructions = require("./test.js");
console.log(mockup_instructions);

const file_data = fs.readFileSync("html/original.html", { encoding: "utf8", flag: "r" });

const $ = cheerio.load(file_data);

$("body").append($.html(hot_reloader));
$(".jsl10n.localized-slogan").text("Hello there!" + mockup_instructions);

let output_html = $.html();
console.log(output_html);
fs.writeFileSync("html/index2.html", output_html);
