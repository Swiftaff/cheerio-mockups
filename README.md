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

2. Start development server `npm run auto_dev`
3. open `original.html` in browser to check html server is running
4. Edit the `src/mockups.js` file to determine the changes you want to make to one or more mockups.

    Saving should hot reload the browser, except when you add new mockups, then you will need to restart the html server so it can find them first.

    ```js
    {
        name: "mockup1",
        instructions: ($,get_template_as_html) => {

            // $ = 'cheerio.js' which is like jquery for static html

            // get_template_as_html = a helper function that takes the string
            // name of a file from your 'src' directory
            // which should have a snippet of html, like a button etc
            // e.g. get_template_as_html("my_template.html")

            //your instructions go here
            $(".jsl10n.localized-slogan").text("Hello there!!");

            // return the cheerio object
            return $;
        },
    }
    ```
