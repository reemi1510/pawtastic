const express = require('express');
const path = require('path');
const fs = require("fs");
const Parser = require("rss-parser");
const { JSDOM } = require("jsdom");
// const json2html = require('node-json2html');

const app = express();

//Set a static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

// Make a new RSS Parser
const parser = new Parser();

async function pullFeed() {

  // Get all the items in the RSS feed
  const feed = await parser.parseURL("https://www.westlondonpetsitter.co.uk/news.xml");
  console.log(feed.title);

  let items = [];

  // Add the items to the items array
  await Promise.all(feed.items.map(async (currentItem) => {

      // Add a new item if it doesn't already exist
      if (items.filter((item) => item === currentItem).length <= 1) {
          items.push(currentItem);
        }
  }));
  return items;
}

app.get('/rss', function(req, res) {
  pullFeed().then(function (result) {
    res.json(result);
  })
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
