const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    .sort("-createdAt")
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });

  return res.status(200).json({
    message: "List Of Posts",
    posts,
  });
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

      // req.flash("success", "Post and Associated Comments Deleted!");

      return res.status(200).json({
        message: "Post and Associated Comments Deleted!",
      });
    } else {
      return res.status(401).json({
        message: "You Cannot Delete This Post!",
      });
    }
  } catch (err) {
    console.log("***********", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
    // req.flash("error", err);
    // console.log("Some error occured", err);
  }
};
