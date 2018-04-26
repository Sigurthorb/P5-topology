let express = require('express');
let app = express();
let bodyParser = require("body-parser");
let http = require('http').Server(app);
let io = require('socket.io')(http);
let db = require("./js/db.js");

app.set('socketio', io);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', express.static('public'));
app.use(require("./js/routes.js")(express.Router()));


app.use(function(err, req, res, next) {
  console.log("ERROR HANDING");
  console.log(err);
  res.status(500).send({error: "UNKNOWN_ERROR"});
});

http.listen(process.env.PORT || 80);

io.on('connection', function(socket){
  socket.emit('topology-change', db.getDB());
});