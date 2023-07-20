const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = function (req, res) {
  // console.log(req.cookies);
  // res.cookie("user_id", 25);

  //Only Populate The Post

  // Post.find({}).then((posts) => {
  //   return res.render("home", {
  //     title: "Codeial | Home",
  //     posts,
  //   });
  // });

  //Populate User of each post
  Post.find({})
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    .exec()
    .then((posts, comments) => {
      User.find({}).then((users) => {
        return res.render("home", {
          title: "Codeial | Home",
          posts,
          comments,
          all_users: users,
        });
      });
    })
    .catch((err) => {
      console.log("Some Error Occured..", err);
    });
};

//module.exports.actionName = function (req, res) {}
