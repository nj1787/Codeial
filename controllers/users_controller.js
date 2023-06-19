module.exports.profile = function (req, res) {
  res.render("profile", {
    title: "Profile",
  });
};

//Render Sign Up Page
module.exports.signUp = function (req, res) {
  return res.render("signup", {
    title: "Codeial || Sign Up",
  });
};

//Render Sign In Page
module.exports.signIn = function (req, res) {
  return res.render("signin", {
    title: "Codeial || Sign In",
  });
};
