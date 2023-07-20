const User = require("../models/user");

module.exports.profile = function (req, res) {
  User.findById(req.params.id)
    .then((user) => {
      res.render("profile", {
        title: "Profile",
        profile_user: user,
      });
    })
    .catch((err) => {
      console.log("Some Error Occured", err);
    });
};

module.exports.update = function (req, res) {
  if (req.params.id == req.user.id) {
    User.findByIdAndUpdate(req.params.id, req.body)
      .then((user) => {
        return res.redirect("back");
      })
      .catch((err) => {
        console.log("Some Error Occured", err);
        return;
      });
  } else {
    return res.status(401).send("Unauthorized");
  }
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

module.exports.destroySession = function (req, res, next) {
  req.logout((err) => {
    return next(err);
  });
  return res.redirect("/");
};
