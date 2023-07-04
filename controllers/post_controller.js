const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = function (req, res) {
  Post.create({
    content: req.body.content,
    user: req.user._id,
  })
    .then((post) => {
      return res.redirect("back");
    })
    .catch((err) => {
      console.log(`Error Occured While Creating A Post: ${err}`);
      return;
    });
};

module.exports.destroy = function (req, res) {
  Post.findById(req.params.id)
    .then((post) => {
      //.id means converting the object id into string
      if (post.user == req.user.id) {
        //post.remove() -- Deprecated
        post.deleteOne();

        Comment.deleteMany({ post: req.params.id })
          .then(() => {
            res.redirect("back");
          })
          .catch((err) => {
            console.log(`Error Occured While Deleting The Post: ${err}`);
            return;
          });
      } else {
        return res.redirect("back");
      }
    })
    .catch((err) => {
      console.log(`Some Error Occured : ${err}`);
    });
};
