const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');
const cheerio = require('cheerio');

const db = require('./models');

const PORT = 3000;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/mongoscraper_db', {
  useMongoCLient: true
});

//add routes
app.get('/scrape', function(req, res){
  request("https://techcrunch.com/", function(error, response, html){
    let $ = cheerio.load(html);

    $('h2.post-title').each(function(i, element){
      let result = {};

      let title = $(element).children().text();
      let link = $(element).children().attr('href');

      result.title = title;
      result.link = link;

      db.Article
        .create(result)
        .then(function(dbArticle){
          res.send('Scrape Complete');
        })
        .catch(function(err){
          res.json(err);
        });
    });
  });
});

app.get('/articles', function(req,res) {
  db.Article
    .find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err){
      res.json(err);
    });
});

// listen for connection
app.listen(PORT, () => {
  console.log('App running on port ' + PORT +'.');
})
