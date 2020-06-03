const sqlite3 = require('sqlite3');
const Promise = require('bluebird');


class FGisDao {

    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if(err)
                console.error('Não foi possível se conectar ao banco de dados!');
            else 
                console.log('Conectado ao banco de dados.');
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if(err) {
                    console.error('Erro ao executar o sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve({id: this.lastID});
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if(err) {
                    console.error('Erro ao executar o sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if(err) {
                    console.error('Erro ao executar o sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = FGisDao;