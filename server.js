// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static('node_modules/vue-localstorage/dist'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/getReadings', function(request, response) {
  db.all('SELECT * from Readings', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});


app.post('/createUser', function(request, response) {
  ifAuthenticated(request.body, function(error, exists)
  {
    console.log(error, exists);
    if (exists)
    {
      response.status(400).send("Already exists");
      return;
    }
    var hash = bcrypt.hashSync(request.body.password, 10);
    db.run("insert into Users (Username, Password) values (?, ?)", [request.body.username, hash], function(error)
    {
      if (error) {
        console.log("Fail", error);
        response.status(500).send("Insert failed");
      }
      else { 
        response.sendStatus(201);
      }
    });
  });
});

app.post('/saveNote', function(request, response) {
  //console.log("saveNote", request.body);
  ifAuthenticated(request.body, function(error, userId){
    if (error)
    {
      response.status(401).send("Wrong username/password!");
    }
    else
    {
      db.run("insert into Notes (userid, day, done, generalnote) select $userid, $day, $done, $note where not exists (select * from Notes where userid=$userid and day=$day);",
        {
          $userid: userId,
          $day: request.body.day,
          $done: sqlBit(request.body.done),
          $note: request.body.note
        },
        function(error){console.log("Fail", error);}
        );
      db.run("update Notes set Done=$done,GeneralNote=$note where userid=$userid and day=$day;",
        {
          $userid: userId,
          $day: request.body.day,
          $done: sqlBit(request.body.done),
          $note: request.body.note
        },
        function(error)
        {
          if (error) {
            console.log("Fail", error);
            response.status(500).send("Update failed");
          }
          else {
            response.sendStatus(200);
          }
        });
    }
  });
});


app.post('/setDone', function(request, response) {
  //console.log("SetDone", request.body);
  ifAuthenticated(request.body, function(error, userId){
    if (error)
    {
      response.status(401).send("Wrong username/password!");
    }
    else
    {
      db.run("insert into Notes (userid, day, done) select $userid, $day, $done where not exists (select * from Notes where userid=$userid and day=$day);",
        {
          $userid: userId,
          $day: request.body.day,
          $done: sqlBit(request.body.done)
        },
        function(error){console.log("Fail", error);}
        );
      db.run("update Notes set Done=$done where userid=$userid and day=$day;",
        {
          $userid: userId,
          $day: request.body.day,
          $done: sqlBit(request.body.done)
        },
        function(error)
        {
          if (error) {
            console.log("Fail", error);
            response.status(500).send("Update failed");
          }
          else {
            response.sendStatus(200);
          }
        });
    }
  });
});

app.get('/getNotes', function(request, response) {
  ifAuthenticated(request.query, function(error, userId){
    if (error)
    {
      console.log("Fail", error);
      response.status(401).send("Wrong username/password!");
    }
    else
    {
      //console.log("Getting notes");
      db.all('SELECT * from Notes where UserID=?',[userId], function(err, rows) {
        console.log(err, rows);
        response.send(JSON.stringify(rows));
      });
    }
  });
});

function ifAuthenticated(data, callback)
{
  if (!data || !data.username || !data.password)
  {
    callback("Missing parameters. Got: ", data);
    return;
  }
  db.get("select * from Users where Username=?", [data.username], function(error,row)
  {
    if (!row || !row.Password)
    {
      console.log("Unauthorised");
      callback("Unauthorised", false);
      return;
    }
    bcrypt.compare(data.password, row.Password)
    .then(function(isMatch){
      if (isMatch)
      {
        console.log("Authorised", row);
        callback(null, row.ID);
      }
      else
      {
        console.log("Unauthorised");
        callback("Unauthorised", true);
      }
    })
    .catch(function(error){
      console.log("Auth error", error);
      callback(error);
    });
  });
}

function sqlBit(val)
{
  return val ? 1 : 0;
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
