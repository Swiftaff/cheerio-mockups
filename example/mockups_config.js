module.exports = {
    input: "example",
    output: "html",
    mockups: [
        {
            name: "test2",
            instructions: function ($, $$) {
                $("h1").text("Hello there!");
                return $;
            },
        },
        /*{
            name: "test",
            instructions: function ($, $$) {
                $("h1").text("Hello there!");
                return $;
            },
        },
        {
            name: "test-really-long-name-that-seems-frankly-too-long",
            instructions: function ($, $$) {
                $("h1").text("Hello there again!");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");
                $("body").append("<p>Long page</p>");

                return $;
            },
        },*/
    ],
};
