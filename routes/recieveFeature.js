var express = require('express');
var router = express.Router();
var FGisDbUtils = require('../localdb/FGisDbUtils');

var fgisDbUtils = new FGisDbUtils();

//recebe a feature desenhada com seus dados e respectivo wkt 
router.post('/', function(req, res, next) {
  console.log(req.body);
  fgisDbUtils.saveFeature(JSON.stringify(req.body));
  res.json(req.body);
});

module.exports = router;