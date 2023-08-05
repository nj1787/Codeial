const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 7500;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
//Used for Session Cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const MongoStore = require("connect-mongo")(session);
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMiddleare = require("./config/middleware");

app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended",
    prefix: "/css",
  })
);

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static("./assets"));
//make the uploads path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(expressLayouts);
//Extract Styles and Scripts from Sub Pages into the Layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//mongo-store is used to store the session cookie in the db
app.use(
  session({
    name: "codeial",
    //TODO change the secret before deployment in production
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleare.setFlash);

//use express router
app.use("/", require("./routes/routes"));

app.listen(port, (err) => {
  if (err) {
    console.log(`Error Occured: ${err}`);
  }
  console.log(`Server Running On Port ${port}`);
});
