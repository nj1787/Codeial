const User = require("../models/user");

module.exports.profile = function (req, res) {
  res.render("profile", {
    title: "Profile",
  });
};

//Render Sign Up Page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("signup", {
    title: "Codeial || Sign Up",
  });
};

//Render Sign In Page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("signin", {
    title: "Codeial || Sign In",
  });
};

//Get Sign Up Data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        User.create(req.body)
          .then((user) => {
            return res.redirect("/users/signin");
          })
          .catch((err) => {
            console.log("Error Occured ", err);
          });
      } else {
        res.redirect("back");
      }
    })
    .catch((err) => {
      console.log("Error Occured ", err);
    });

  //The Below Method No Longer Accepts Call-Back
  // User.findOne({ email: req.body.email }, function (err, user) {
  //   if (err) {
  //     console.log("Error Finding User While Signing Up....");
  //     return;
  //   }

  //   if (!user) {
  //     User.create(req.body, function (err, user) {
  //       if (err) {
  //         console.log("Error Finding User While Signing Up....");
  //         return;
  //       }
  //       return res.redirect("/users/signin");
  //     });
  //   } else {
  //     res.redirect("back");
  //   }
  // });
};

//Sign In And Create A Session
module.exports.createSession = function (req, res) {
  return res.redirect("/");
};
