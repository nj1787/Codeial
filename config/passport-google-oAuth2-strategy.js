const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

//tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID:
        "856426723335-iohcipu7d0948o0r11u01l0vqrnu3jja.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:7500/users/auth/google/callback",
    },

    function (accessToken, refreshToken, profile, done) {
      //find a user
      User.findOne({ email: profile.emails[0].value })
        .exec()
        .then((user) => {
          console.log(profile);
          //if found, set this user as req.user
          if (user) {
            return done(null, user);
          } else {
            //if not found, create the user and set it as req.user
            User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            });
            return newUser
              .save()
              .then((savedUser) => {
                done(null, savedUser);
              })
              .catch((err) => {
                console.log("Some Error Occured ", err);
              });
          }
        })
        .catch((err) => {
          console.log(
            "Some Error Occured While Setting Up Google Oauth2 ",
            err
          );
          return done(err);
        });
    }
  )
);

module.exports = passport;
