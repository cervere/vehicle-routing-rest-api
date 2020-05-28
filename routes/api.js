var express = require("express");
var pathGenRouter = require("./generatepaths")

var app = express();
app.use(express.urlencoded({
    extended: true
}))
app.use("/path/", pathGenRouter);

module.exports = app;