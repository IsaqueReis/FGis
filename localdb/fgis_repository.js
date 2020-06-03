const sqlite3        = require('sqlite3').verbose();
var path             = require('path');
var connectionPath   = path.join(path.dirname(__filename), 'fgis.db');

class FGisRepository {

    constructor(dao) {
        this.dao = dao;
    }

    save(feature) {
        return this.dao
                .run('INSERT INTO features(feature_data) VALUES (?)',
                [feature]);
    }

    update(feature) {
        const {id, json} = feature;
        return this.dao
                .run('UPDATE features SET feature_data = ? WHERE id = ?',
                [json, id]);
    }

    delete(id) {
        return this.dao
                .run('DELETE FROM features WHERE id = ?',
                [id]);
    }

    getById(id) {
        return this.dao
                .get('SELECT * FROM features WHERE id = ?',
                [id]);
    }

    getAll() {
        return this.dao
                .all('SELECT * FROM features');
    }
}

module.exports = FGisRepository;






