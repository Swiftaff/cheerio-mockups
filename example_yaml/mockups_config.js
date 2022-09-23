module.exports = {
    input: "example_yaml",
    output: "html",
    mockups: [
        {
            name: "yaml_test",
            instructions: function ($, html) {
                $("head").prepend(html("head_bootstrap.html"));
                $("body").prepend(html("test_template.html"));
                return $;
            },
        },
    ],
};
