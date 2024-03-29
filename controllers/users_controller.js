const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const util = require("util");
const redirectPromise = util.promisify(require("express").response.redirect);

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

//Async Await
module.exports.update = async function (req, res) {
  if (req.user.id === req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("********Multer Error*********", err);
        }
        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          // if (user.avatar) {
          //   fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          // }

          fs.unlink("./uploads/users" + req.file.filename, (err) => {
            if (err) {
              console.log("Failed To Delete...." + err);
            } else {
              console.log("Successfully Deleted...");
            }
          });

          //this is saving the path of the uploaded file into the avatar field in the user
          user.avatar = User.avatarPath + "/" + req.file.fileName;
        }

        user.save();
        console.log(req.body);
        console.log(req.file);
        return res.redirect("back");
      });
    } catch (err) {
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized");
    return res.status(401).send("Unauthorized");
  }
};

//Legacy Code

// module.exports.update = function (req, res) {
//   if (req.params.id == req.user.id) {
//     User.findByIdAndUpdate(req.params.id, req.body)
//       .then((user) => {
//         return res.redirect("back");
//       })
//       .catch((err) => {
//         console.log("Some Error Occured", err);
//         return;
//       });
//   } else {
//     return res.status(401).send("Unauthorized");
//   }
// };

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
module.exports.createSession = (req, res) => {
  req.flash('success', 'Logged In Successfully');
  return res.redirect('/');
};

module.exports.destroySession = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out!");
    return res.redirect("/");
  });
};

// module.exports.destroySession = function (req, res, next) {
//   req.logout((err) => {
//     return next(err);
//   });
//   req.flash("success", "Logged Out Successfully");
//   return res.redirect("/");
// };
