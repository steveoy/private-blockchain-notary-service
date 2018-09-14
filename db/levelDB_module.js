<<<<<<< HEAD:levelDB_module.js
module.exports = (function (db_folder) {
=======
module.exports = (function (db_folder, encoding = "utf-8") {
>>>>>>> clean-architecture:db/levelDB_module.js
    const level = require('level');
    const chainDB = "./" + db_folder;
    const db = level(chainDB, { valueEncoding: encoding });



    var levelDB = {

        createReadStream: function () {
            return db.createReadStream()
        },
        //Adding new Block to DB
        _addLevelDBData: function (key, value) {
            return new Promise((resolve, reject) => {
                db.put(key, value, function (err) {
                    if (err) reject(err); else resolve("success");
                })
            })

        },

        //Getting Block by key
        _getLevelDBData: function (key) {
            return db.get(key);
        },

        //Deleting Block by key
        _deleteLevelDBData: function (key) {
            db.del(key, function (err) {
                if (err)
                    return console.log('Error deleting Block #' + key, err);
            });
        },

        _updateLevelDBData: function (key, value) {
            return new Promise((resolve, reject) => {
                db.batch()
                    .del(key)
                    .put(key, value)
                    .write(function (err) { 
                        if (err) reject(err); 
                        resolve("success");
                    });
            });
        }
        // ,
        // //Update Data
        // _updateLevelDBData: function (key, value) {
        //     return new Promise((resolve, reject) => {
        //         db.batch()
        //             .del(key)
        //             .put(key, value)
        //             .write(function (err) {
        //                 if (err)
        //                     reject(err);
        //                 resolve("success");
        //             });
        //     });
        // }
    };

    return levelDB;
});
