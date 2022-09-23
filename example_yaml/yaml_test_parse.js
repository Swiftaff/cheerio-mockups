const yaml = require("js-yaml");
const fs = require("fs");

// Get document, or throw exception on error
try {
    const doc = yaml.load(fs.readFileSync("./example_yaml/test.yaml", "utf8"));
    console.log(doc[0]);
} catch (e) {
    console.log(e);
}
