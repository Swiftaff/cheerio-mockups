module.exports = function (name) {
    console.log("bootstrap markup generator");
    switch (name) {
        case "container":
            return `<div class="container"></div>`;
            break;
        default:
            return "";
            break;
    }
};
