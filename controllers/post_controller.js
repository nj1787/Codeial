const Post = require("../models/post");
const Comment = require("../models/comment");

//Using Async Await

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    if (req.xhr) {
      return res.status(200).json({
        data: {
          post,
        },
        message: "Post Created",
      });
    }

    req.flash("success", "Post Published!");
    return res.redirect("back");
  } catch (err) {
    req.flash("error", err);
    // console.log("Some Error Occured", err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);

    if (post.user == req.user.id) {
      post.deleteOne();

      await Comment.deleteMany({ post: req.params.id });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post Deleted Successfully",
        });
      }

      req.flash("success", "Post and Associated Comments Deleted!");

      return res.redirect("back");
    } else {
      req.flash("error", "You Cannot Delete This Post!");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    // console.log("Some error occured", err);
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
