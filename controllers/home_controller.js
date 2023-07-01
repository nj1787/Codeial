const Post = require("../models/post");

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
      return res.render("home", {
        title: "Codeial | Home",
        posts,
        comments,
      });
    });
};

//module.exports.actionName = function (req, res) {}
