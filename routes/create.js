var express = require('express');
var router = express.Router();

/* GET create page. */
router.get('/', function(req, res, next) {
  res.render('create', { title: 'create' });
});

module.exports = router;
