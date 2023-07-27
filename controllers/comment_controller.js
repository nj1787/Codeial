const Comment = require("../models/comment");
const Post = require("../models/post");

//Using Async Await
module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      post.comments.push(comment);
      post.save();

      res.redirect("/");
    }
  } catch (err) {
    console.log("Some Error Occured", err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.user == req.user.id) {
      let postId = comment.post;

      comment.deleteOne();

      //While Finding The Post We Are Pulling Out The CommentId Which Was Deleted
      let post = Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });

      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Some Error Occured", err);
    return;
  }
};

/*****************************Legacy Code**************/

// module.exports.create = function (req, res) {
//   Post.findById(req.body.post).then((post) => {
//     if (post) {
//       Comment.create({
//         content: req.body.content,
//         post: req.body.post,
//         user: req.user._id,
//       })
//         .then((comment) => {
//           post.comments.push(comment);
//           post.save();

//           res.redirect("/");
//         })
//         .catch((err) => {
//           console.log("Some Error Occured", err);
//         });
//     }
//   });
// };

// module.exports.destroy = function (req, res) {
//   Comment.findById(req.params.id)
//     .then((comment) => {
//       if (comment.user == req.user.id) {
//         let postId = comment.post;

//         comment.deleteOne();

//         Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } })
//           .then((post) => {
//             return res.redirect("back");
//           })
//           .catch((err) => {
//             console.log(`Error Occured While Deleting Comment : ${err}`);
//           });
//       } else {
//         return res.redirect("back");
//       }
//     })
//     .catch((err) => {
//       console.log(`Some Error Occured : ${err}`);
//     });
// };
