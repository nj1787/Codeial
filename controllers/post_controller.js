const Post = require("../models/post");
const Comment = require("../models/comment");

//Using Async Await

module.exports.create = async function (req, res) {
  try {
    await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    return res.redirect("back");
  } catch (err) {
    console.log("Some Error Occured", err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);

    if (post.user == req.user.id) {
      post.deleteOne();

      await Comment.deleteMany({ post: req.params.id });
      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Some error occured", err);
  }
};

/***************************Legacy Code*******************/
// module.exports.create = function (req, res) {
//   Post.create({
//     content: req.body.content,
//     user: req.user._id,
//   })
//     .then((post) => {
//       return res.redirect("back");
//     })
//     .catch((err) => {
//       console.log(`Error Occured While Creating A Post: ${err}`);
//       return;
//     });
// };

// module.exports.destroy = function (req, res) {
//   Post.findById(req.params.id)
//     .then((post) => {
//       //.id means converting the object id into string
//       if (post.user == req.user.id) {
//         //post.remove() -- Deprecated
//         post.deleteOne();

//         Comment.deleteMany({ post: req.params.id })
//           .then(() => {
//             res.redirect("back");
//           })
//           .catch((err) => {
//             console.log(`Error Occured While Deleting The Post: ${err}`);
//             return;
//           });
//       } else {
//         return res.redirect("back");
//       }
//     })
//     .catch((err) => {
//       console.log(`Some Error Occured : ${err}`);
//     });
// };
