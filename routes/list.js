var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('list', { title: 'Listar local'});
});

module.exports = router;
