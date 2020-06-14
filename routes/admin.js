var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('admin', { title: 'Painel administrativo' });
});

module.exports = router;