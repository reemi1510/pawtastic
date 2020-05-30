const express = require('express');
const path = require('path');
const fs = require("fs");
const Parser = require("rss-parser");
const json2html = require('node-json2html');

const app = express();

//Set a static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

(async function main() {

    // Make a new RSS Parser
    const parser = new Parser();

    // Get all the items in the RSS feed
    const feed = await parser.parseURL("https://www.westlondonpetsitter.co.uk/news.xml");

    let items = [];

    // Clean up the string and replace reserved characters
    const fileName = `${feed.title.replace(/\s+/g, "-").replace(/[/\\?%*:|"<>]/g, '').toLowerCase()}.json`;
    if (fs.existsSync(fileName)) {
        items = require(fileName);
    }

    // Add the items to the items array
    await Promise.all(feed.items.map(async (currentItem) => {

        // Add a new item if it doesn't already exist
        if (items.filter((item) => item === currentItem).length <= 1) {
            items.push(currentItem);
        }
        
    }));

    // Save the file
    fs.writeFileSync(fileName, JSON.stringify(items));

})();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
