const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('FGis.db', sqlite3.OPEN_CREATE, (err) => {
    if(err)
        return console.error(err.message);
    else 
        console.log("Conectado ao banco de dados local do FGis!");
});

class FGisDbUtils {

    constructor() {}

    saveFeature(feature) {

        console.log("save fature: " + feature.toString());

        db.serialize(function () {
            
            console.log("save fature!");
            let stmt = db.prepare("INSERT INTO features(feature_data) VALUES (?)");
            stmt.run(feature);
            stmt.finalize();
            
        });

        //finaliza o bd
        db.close((err) => {
            if (err)
                return console.error(err.message);
            else
                console.log("Fechando a conexão com o banco!");
        });
    }
}

module.exports = FGisDbUtils;






