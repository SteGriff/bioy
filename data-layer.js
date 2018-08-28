var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

var createScript = 'CREATE TABLE Users (username nvarchar(50))');

var dataLayer = {
  setup : function(dbFile)
  {
    // if ./.data/sqlite.db does not exist, create it, otherwise print records to console
    db.serialize(function(){
    if (!exists) {
      db.run(createScript);
      console.log('New table Users created!');

      // insert default dreams
      db.serialize(function() {
        db.run('INSERT INTO Users (dream) VALUES ("Find and count some sheep"), ("Climb a really tall mountain"), ("Wash the dishes")');
      });
    }
    else {
      console.log('Database "Dreams" ready to go!');
      db.each('SELECT * from Dreams', function(err, row) {
        if ( row ) {
          console.log('record:', row);
        }
      });
    }
    });
  }
  
};

module.exports = dataLayer;