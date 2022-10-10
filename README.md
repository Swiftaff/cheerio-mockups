# Easily create mockup variants of an existing page with Single-filez/Cheerio/Playwright

## Why?

If you want to demonstrate a minor change to an existing site (change text or colour of a button, repositioning new elements, perhaps doing multiple variants to find the best approach or for client approvals) then typically you can do that in a couple of ways:

1. use browser developer tools to edit the markup and styles temporarily - but those changes are easily lost - and need to be noted separately or just forgotten and redone
1. more permanently you can copy an existing page's html locally, fix any issues with files not working locally, make the actual changes manually on top of the original file, and copy/paste multiple copies - and litter the original file with comments so you can later recall what changes have been made
1. or just go in and make the final changes in the codebase, and build, commit, deploy or whatever it takes to preview it

Instead, this library keeps the original intact, and applies a list of changes from a js file on-the-fly so it is VERY easy to undo changes, and try new variants. Any new html or inline styles can easily be loaded in from html snippets.

## How?

-   The separate Single-filez makes copying an entire existing page easy
-   Cheerio makes updating static html easy like jQuery (refer to older version for commands: https://github.com/cheeriojs/cheerio/tree/aa90399c9c02f12432bfff97b8f1c7d8ece7c307)
-   Playwright makes taking screengrabs easy
-   This library just auto-builds each mockup based on a 'mockups_config.js' or 'mockups_config.json' definition file, and creates a hot reloading web socket sirv server to develop with
-   additionally it provides an interface to easily find selectors and apply changes to auto-update the config file

## Instructions

### Install

1. Not saved to npm yet, so just reference a specific commit, e.g.

```js
npm i https://github.com/Swiftaff/cheerio-mockups#bee7ed29c1f8f4d1b988eb370911d75e43687561
```

1. create directories for input: `src` and output: `html`
1. in `src` create a `mockups_config.js` file, with a basic config such as

```js
module.exports = {
    input: "src",
    output: "html",
    original: "original.html",
    mockups: [
        {
            name: "test",
            instructions: function ($, html, yaml) {
                $("h1").text("Hello there!");
                return $;
            },
        },
    ],
};
```

1. or create a `mockups_config.json` file without the leading `module.exports = ` or trailing `;`
1. if both a `.js` and `.json` file exists, `.js` is preferred and used - just because it's possible to comment out sections of the module if needed!

1. also in `src` create an `index.js` file, calling the library, which will automatically pull in the config file.

```
const mockups = require("cheerio-mockups");
mockups();
```

### Save the original page from the site you wish to base the mockups from

1. Install the Single-fileZ Firefox extension: https://addons.mozilla.org/firefox/addon/singlefilez
1. Change extension Settings/options to avoid basic issues:
    - User interface - uncheck "display an infobar..."
    - HTML content - uncheck everything
    - Stylesheets - uncheck everything
1. Run Single-filez on your page, and export as a .html
1. Open the exported .html file in a browser and check it works in desktop and mobile
1. The .html is really a zip, rename it to .zip and unzip the contents of the zip - and copy the contents into the `html` folder
1. Fix any minor markup validation issues
1. Rename the `index.html` to `original.html` - this page will form the basis of all your mockup variants of this page (see wikipedia example)

### Run the dev server and start making one or more mockup variants of the page using [https://cheerio.js.org/](cheerio.js) script

1. Start development server `node src/index.js`
1. open `http://localhost:3000` in browser to check html server is running and the original page still looks ok
1. Now is a good time to `git init` and commit your changes before continuing
1. Edit the `src/mockups_config.js` (or `.json`) file to define the changes you want to make for one or more mockups, and open those urls in a browser, e.g. `http://localhost:3000/mockup1.html`
1. alternatively in the index of localhost is a basic interface to make edits and view each mockup, as well as view at various device widths

    ```js
    module.exports = {
        // general settings
        output: "html",
        original: "original.html",

        // first mockup definition will auto-create a `mockup1.html` page
        // using the `original.html` as a template and applying your cheerio
        // commands below to make any changes you want
        // including any new snippets of html
        mockups:[
            {
            name: "mockup1",
            instructions: ($, html, yaml) => {
                // $ = 'cheerio.js' which is like jquery for static html

                //your cheerio instructions go here
                $(".jsl10n.localized-slogan").text("Hello there!!");

                // html = a helper function which gets a snippet of html
                // from a file from your 'input' directory,
                // e.g. `<button>Test button</button>`
                $("body").append(html("test_template.html"));

                // yaml = a helper function which reads a yaml file, to generate bootstrap code!
                // from a file from your 'input' directory,
                // e.g.
                //- button.btn btn-primary#id=test type=button:
                //    - html: test button
                //
                //will import
                //<button class="btn btn-primary" id="test" type="button">test button</button>

                $("body").prepend(yaml("test_template.yaml"));

                // return the cheerio object
                return $;
            },
        },
        //other mockup variants
        { ... },
        ]
    };
    ```

1. Saving this or any files in the 'src' folder should hot reload the browser

### Use the resulting HTML mockups

1. Manually take screengrabs of e.g. desktop and tablet sizes and send for review - TODO take automated screengrabs using playwright - TODO display thumbnails in automated index file - or in a PDF template
1. Manually create a zip file from `html` folder, and send or upload these somewhere for review - TODO automate zip file creation
