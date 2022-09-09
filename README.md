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

1. Todo
