const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const User = require("../models/user");

//Authentication Using Passport
passport.use(
  new localStrategy(
    {
      usernameField: "email",
    },
    function (email, password, done) {
      //Find a user and Establish Identity
      User.findOne({ email: email })
        .then((user) => {
          if (!user || user.password != password) {
            console.log("Invalid Credentials");
            return done(null, false);
          }
          return done(null, user);
        })
        .catch((err) => {
          console.log("Error In Finding User --> Passport");
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

module.exports = passport;
