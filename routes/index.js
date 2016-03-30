var express = require('express');
var router = express.Router();
var sentiment = require('sentiment');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/analyze', function (req, res, next) {
  var tweet = decodeURIComponent(req.query.tweet);
  var analyzed = sentiment(tweet);
  console.log(analyzed.score);
  res.status(200).send(analyzed);
});

module.exports = router;
