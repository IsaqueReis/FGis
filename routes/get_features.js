var express = require('express');
var FGisDao = require('../localdb/dao');
var FGisRepository = require('../localdb/fgis_repository');
var path = require('path');

var router = express.Router();
var dbPath = path.resolve('./localdb/fgis.db');
console.log(dbPath);
var dao = new FGisDao(dbPath);
var fgisRepository = new FGisRepository(dao);

//devolve uma lista com todas as features cadastradas no banco
router.get('/', function(req, res, next) {
    fgisRepository.getAll()
    .then(features => {
        res.send(JSON.stringify(features));
    });
});

module.exports = router;


