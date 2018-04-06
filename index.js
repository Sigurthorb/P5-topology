let express = require('express');
let bodyParser = require("body-parser");

let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require("./js/routes.js")(express.Router()));

app.use(function(err, req, res, next) {
  console.log("ERROR HANDING");
  console.log(err);
  res.status(500).send({error: "UNKNOWN_ERROR"});
});

app.listen(process.env.PORT || 80);
