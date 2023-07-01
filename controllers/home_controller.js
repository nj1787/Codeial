const Post = require("../models/post");

module.exports.home = function (req, res) {
  // console.log(req.cookies);
  // res.cookie("user_id", 25);
  // Post.find({}).then((posts) => {
  //   return res.render("home", {
  //     title: "Codeial | Home",
  //     posts,
  //   });
  // });

  //Populate User of each post
  Post.find({})
    .populate("user")
    .exec()
    .then((posts) => {
      return res.render("home", {
        title: "Codeial | Home",
        posts,
      });
    });
};

//module.exports.actionName = function (req, res) {}
