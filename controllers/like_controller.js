const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");

module.exports.toggleLike = async function (req, res) {
  try {
    // likes/toggle/?id=abcd&type=post
    let likeable;
    let deleted = false;

    if (req.query.type == "Post") {
      likeable = await Post.findById(req.query.id).populate("likes");
    } else {
      likeable = await Comment.findById(req.query.id).populate("likes");
    }

    //check if like already exists
    let existingLike = await Like.findOne({
      likeable: req.query.id,
      onModel: req.query.type,
      user: req.user._id,
    });

    // if a like already exists, delete it
    if (existingLike) {
      likeable.likes.pull(existingLike._id);
      likeable.save();

      existingLike.remove();

      deleted = true;
    } else {
      //make a new like
      let newLike = await Like.create({
        user: req.user._id,
        likeable: req.query.id,
        onModel: req.query.type,
      });

      likeable.likes.push(like._id);
      likeable.save();
    }

    return res.status(200).json({
      message: "Request Successful",
      data: {
        deleted,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
