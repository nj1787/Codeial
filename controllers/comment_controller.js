const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require("../mailers/comment_mailer");
const commentEmailWorker = require("../workers/comment_email_worker");
const queue = require("../config/kue");
const Like = require("../models/like");
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

      comment = await comment.populate("user", "name email");
      // commentsMailer.newComment(comment);
      const job = queue.create("email", comment).save(function (err) {
        if (err) {
          console.log("Error in creating a queue", err);
          return;
        }
        console.log("Job Enqueued", job.id);
      });
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment,
          },
          message: "Comment Created",
        });
      }

      req.flash("success", "Comment Added To Post!");
      res.redirect("/");
    }
  } catch (err) {
    req.flash("error", err);
    // console.log("Some Error Occured", err);
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

      //destroy the associated likes for this comment
      await Like.deleteMany({ likeable: comment._id, onModel: "Comment" });

      //send the comment id which was deleted back to the views
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Post Deleted",
        });
      }

      req.flash("success", "Comment For The Post Deleted!");
      return res.redirect("back");
    } else {
      req.flash("error", "You Cannot Delete Comment For The Post!");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    // console.log("Some Error Occured", err);
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
