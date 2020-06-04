var express = require('express');
var FGisDao = require('../localdb/dao');
var FGisRepository = require('../localdb/fgis_repository');
var path = require('path');

var router = express.Router();
var dbPath = path.resolve('./localdb/fgis.db');
console.log(dbPath);
var dao = new FGisDao(dbPath);
var fgisRepository = new FGisRepository(dao);

//recebe a feature desenhada com seus dados e respectivo wkt 
router.post('/', function(req, res, next) {
  console.log(req.body);
  fgisRepository.save(JSON.stringify(req.body));
});

module.exports = router;