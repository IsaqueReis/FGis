var express = require('express');
var Promise = require('bluebird');
var FGisDao = require('../localdb/dao');
var FGisRepository = require('../localdb/fgis_repository');
var path = require('path');

var router = express.Router();
var dbPath = path.resolve('./localdb/fgis.db');
console.log(dbPath);
var dao = new FGisDao(dbPath);
var fgisRepository = new FGisRepository(dao);

/* GET create page. */
router.get('/', function(req, res, next) {
  fgisRepository.getAll()
                .then(features => {
                  res.render('list', { title: 'Listar local', features: JSON.stringify(features) });
                });
  
});

module.exports = router;
