module.exports = {
    input: "example",
    output: "html",
    mockups: [
        {
            name: "test",
            instructions: function ($, $$) {
                $("h1").text("Hello there!");
                return $;
            },
        },
    ],
};
