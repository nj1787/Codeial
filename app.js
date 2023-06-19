const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 7500;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static("./assets"));

app.use(expressLayouts);
//Extract Styles and Scripts from Sub Pages into the Layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//use express router
app.use("/", require("./routes/routes"));

//set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(port, (err) => {
  if (err) {
    console.log(`Error Occured: ${err}`);
  }
  console.log(`Server Running On Port ${port}`);
});
