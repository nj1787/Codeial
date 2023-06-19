const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/codeial_dev");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error Conencting To MongoDB"));

db.once("open", function () {
  console.log("Connected To MongoDB Database");
});

module.exports = db;
