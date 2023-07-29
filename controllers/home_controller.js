const Post = require("../models/post");
const User = require("../models/user");

//Using Async-Await

module.exports.home = async function (req, res) {
  //Populate Post Of Each User
  try {
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });
    let users = await User.find({});

    return res.render("home", {
      title: "Codeial || Home",
      posts,
      all_users: users,
    });
  } catch (err) {
    console.log("Some error Occured", err);
    return;
  }
};

/*******************Leagacy Code************************/

// module.exports.home = function (req, res) {
//   // console.log(req.cookies);
//   // res.cookie("user_id", 25);

//   //Only Populate The Post

//   // Post.find({}).then((posts) => {
//   //   return res.render("home", {
//   //     title: "Codeial | Home",
//   //     posts,
//   //   });
//   // });

//   //Populate User of each post
//   Post.find({})
//     .populate("user")
//     .populate({
//       path: "comments",
//       populate: {
//         path: "user",
//       },
//     })
//     .exec()
//     .then((posts, comments) => {
//       User.find({}).then((users) => {
//         return res.render("home", {
//           title: "Codeial | Home",
//           posts,
//           comments,
//           all_users: users,
//         });
//       });
//     })
//     .catch((err) => {
//       console.log("Some Error Occured..", err);
//     });
// };

//module.exports.actionName = function (req, res) {}
