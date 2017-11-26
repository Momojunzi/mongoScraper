const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');
const cheerio = require('cheerio');

const db = require('./models');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoscraper_db";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoCLient: true
});

//add routes
app.get('/scrape', function(req, res){
  request("https://techcrunch.com/", function(error, response, html){
    let $ = cheerio.load(html);
    $('div.block-content').each(function(i, element){
      let result = {};
      result.title = $(element).children('h2.post-title').children().text();
      result.link = $(element).children('h2.post-title').children().attr('href');
      result.summary = $(element).children('p.excerpt').text();
      db.Article
        .create(result)
        .catch(function(err){
          res.json(err);
        });
    });
  });
  res.json("scrape complete");
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

app.get('/articles/:id', function(req,res){
  db.Article
    .findOne({_id: req.params.id})
    .populate('note')
    .then(function(dbArticle){
      res.json(dbArticle);
    })
    .catch(function(err){
      res.json(err);
    });
});

app.post('/articles/:id', function(req, res){
  db.Note
  .create(req.body)
  .then(function(dbNote){
    return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
  })
  .then(function(dbArticle){
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
