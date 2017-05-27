var express = require('express');
var router = express.Router();

router.get('/player', function(req, res, next) {
  res.render('player', { title: 'Bird Free Music' });
});

module.exports = router;
