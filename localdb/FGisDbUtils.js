const sqlite3 = require('sqlite3').verbose();
var path = require('path');
var dbPaht= path.join(path.dirname(__filename), 'fgis.db');
var connectionStatus = false;

var db = new sqlite3.Database(dbPaht, (err) => {

    if(err) {

        connectionStatus = false;
        return console.error(err.message);
        
    } else {

        console.log("Conectado ao banco de dados local do FGis!");
        connectionStatus = true;
    }
        
});

class FGisDbUtils {

    constructor() {}

    saveFeature(feature) {

        if(connectionStatus)
        {
            db.serialize(function () {
            
                console.log("save fature!");
                let stmt = db.prepare("INSERT INTO features(feature_data) VALUES (?)");
                stmt.run(feature);
                stmt.finalize();
                
            });

        } else {

            db = new sqlite3.Database(dbPaht, (err) => {

                if(err) {
            
                    connectionStatus = false;
                    return console.error(err.message);
                    
                } else {
            
                    console.log("Conectado ao banco de dados local do FGis!");
                    connectionStatus = true;
                }
                    
            });

            db.serialize(function () {
            
                console.log("save fature!");
                let stmt = db.prepare("INSERT INTO features(feature_data) VALUES (?)");
                stmt.run(feature);
                stmt.finalize();
                
            });
        }


        //finaliza o bd
        db.close((err) => {
            if (err)
            {
                connectionStatus = true;
                return console.error(err.message);
            } else {
                connectionStatus = false;
                console.log("Fechando a conexão com o banco!");
            }
                
        });
    }
}

module.exports = FGisDbUtils;






