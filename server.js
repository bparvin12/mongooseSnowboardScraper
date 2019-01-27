//require dependencies 
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 3000;

var app = express();

var router = express.Router();

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//use bodyParser in our app
app.use(bodyParser.urlencoded({ extended: false }));

app.use(router);


//if deployed use the deployed database. otherwise use the local mongoheadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadLines";

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