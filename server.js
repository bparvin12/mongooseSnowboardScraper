//require dependencies 
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");

var PORT = process.env.PORT || 3000;

var app = express();

var router = express.Router();

require("./config/routes.js")(router);

app.use(express.static("public"));

app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.get('/', function (req, res) {
    res.render('home');
});

app.use(logger("dev"));
//use bodyParser in our app
app.use(bodyParser.urlencoded({ extended: false }));

app.use(router);


//if deployed use the deployed database. otherwise use the local mongoSnowboards database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoSnowboards";

mongoose.set('useCreateIndex', true);
//connect mongoose to our databse
mongoose.connect(db, {useNewUrlParser: true}, function (error) {
    if (error) {
        console.log(error);
    }
    else {
        console.log("mongoose connection is successful");
    }
});

app.listen(PORT, function () {
    console.log("Listening on http://localhost:" + PORT);
})