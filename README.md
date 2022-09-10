# Mockup changes to existing page with Single-filez/Cheerio/Playwright

## Save the original page to update

1. Install the Single-fileZ Firefox extension: https://addons.mozilla.org/firefox/addon/singlefilez
1. Change extension Settings/options to avoid basic issues:
    - User interface - uncheck "display an infobar..."
    - HTML content - uncheck everything
    - Stylesheets - uncheck everything
1. Run Single-filez on your page, and export as a .html
1. Open the exported .html file in a browser and check it works in desktop and mobile
1. The .html is really a zip, rename it to .zip and unzip the contents of the zip - and copy the contents into the `html` folder
1. Fix any minor markup validation issues
1. Rename the `index.html` to `original.html`

## Make one or more copies of the page with your mockup changes using cheerio script

1. Start development server `npm run auto_dev`
1. open `http://localhost:3000/original.html` in browser to check html server is running
1. Edit the `src/mockups.js` file to define the changes you want to make for one or more mockups, and open those urls in a browser, e.g. `http://localhost:3000/mockup1.html`

    ```js
    module.exports = [
        // first mockup definition will auto-create a `mockup1.html` page
        // using the `original.html` as a template and applying your cheerio
        // commands below to make any changes you want
        // including any new snippets of html
        {
            name: "mockup1",
            instructions: ($, $$) => {
                // $ = 'cheerio.js' which is like jquery for static html

                //your cheerio instructions go here
                $(".jsl10n.localized-slogan").text("Hello there!!");

                // $$ = a helper function which gets a snippet of html
                // from a file from your 'src' directory,
                // e.g. `<button>Test button</button>`
                $("body").append($$("test_template.html"));

                // return the cheerio object
                return $;
            },
        },
        { ... },
    ];
    ```

1. Saving this or any files in the 'src' folder should hot reload the browser
1. TODO auto-create index page to link mockups from

## Use the resulting HTML mockups

1. Manually take screengrabs of e.g. desktop and tablet sizes and send for review - TODO take automated screengrabs using playwright - TODO display thumbnails in automated index file - or in a PDF template
1. Manually create a zip file from `html` folder, and send or upload these somewhere for review - TODO automate zip file creation
