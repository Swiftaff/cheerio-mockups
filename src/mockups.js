module.exports = [
    {
        name: "mockup1",
        instructions: ($, $$) => {
            $(".jsl10n.localized-slogan").text("Hello there!!");
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
