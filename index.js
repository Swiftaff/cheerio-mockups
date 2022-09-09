const cheerio = require("cheerio");
const fs = require("fs");
const mockup_instructions = require("./test.js");
console.log(mockup_instructions);
const file_data = fs.readFileSync("html/index.html", { encoding: "utf8", flag: "r" });
//console.log(file_data);

const $ = cheerio.load(file_data);

$(".jsl10n.localized-slogan").text("Hello there!" + mockup_instructions);

let output_html = $.html();
fs.writeFileSync("html/index2.html", output_html);
