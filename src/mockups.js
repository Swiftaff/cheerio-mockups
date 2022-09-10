module.exports = [
    // refer to older instructions: https://github.com/cheeriojs/cheerio/tree/aa90399c9c02f12432bfff97b8f1c7d8ece7c307#selectors
    {
        name: "mockup1",
        instructions: ($, $$) => {
            $(".jsl10n.localized-slogan").text("Hello there!!");
            $("#js-lang-list-button").replaceWith($$("test_template.html"));
            return $;
        },
    },
    {
        name: "mockup2",
        instructions: ($, $$) => {
            $(".jsl10n.localized-slogan").text("Hello again!!!");
            $("body").append($$("test_template.html"));
            return $;
        },
    },
    {
        name: "mockup3",
        instructions: ($, $$) => {
            $(".jsl10n.localized-slogan").text("Hello again!!!");
            $("body").append($$("test_template.html"));
            return $;
        },
    },
    {
        name: "mockup4",
        instructions: ($, $$) => {
            $(".jsl10n.localized-slogan").text("Hello again!!!");
            $("body").append($$("test_template.html"));
            return $;
        },
    },
];
