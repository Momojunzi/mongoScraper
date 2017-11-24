var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

var db = require('./models');

var PORT = 3000;

var app = express();

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
    let results = [];
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

      results.push({
        title,
        link
      });
    });
    console.log(results);
  });
});

// listen for connection
app.listen(PORT, () => {
  console.log('App running on port ' + PORT +'.');
})
