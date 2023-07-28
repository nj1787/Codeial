const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const User = require("../models/user");

//Authentication Using Passport
passport.use(
  new localStrategy(
    {
      usernameField: "email",
      //This allows us to set the first argument as req
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      //Find a user and Establish Identity
      User.findOne({ email: email })
        .then((user) => {
          if (!user || user.password != password) {
            req.flash("error", "Invalid Username / Password");
            // console.log("Invalid Credentials");
            return done(null, false);
          }
          return done(null, user);
        })
        .catch((err) => {
          req.flash("error", err);
          // console.log("Error In Finding User --> Passport");
          return done(err);
        });
    }
  )
);

//searializing the user to decide which key is to be kept in the cookies.
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//deserializing the user to from the key in the cookies.
passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      return done(null, user);
    })
    .catch((err) => {
      console.log("Error In Finding User --> Passport");
      return done(err);
    });
});

//check if the user is authenticated
passport.checkAuthentication = (req, res, next) => {
  //if the user is signed in , the pass on the request to the next function (controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  //if the user is not signed in
  return res.redirect("/users/signin");
};

passport.setAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    //req.user contains the current signed in user from the session cookie and we are just sending
    //this to the locals for the views.
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
