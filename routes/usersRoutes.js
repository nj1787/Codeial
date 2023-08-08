const express = require("express");

const router = express.Router();

const passport = require("passport");

const usersController = require("../controllers/users_controller");

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  usersController.profile
);

router.post(
  "/update/:id",
  passport.checkAuthentication,
  usersController.update
);

router.get("/signin", usersController.signIn);

router.get("/signup", usersController.signUp);

router.post("/create", usersController.create);

//use passport as a middleware to authenticate
router.post(
  "/createSession",
  passport.authenticate("local", { failureRedirect: "/users/signin" }),
  usersController.createSession
);

router.get("/signout", usersController.destroySession);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
//This is the URL at which I will Get The Data
router.get(
  "/auth/google/callback",
  passport.authenticate(
    "google",
    { failureRedirect: "/users/signin" },
    usersController.createSession
  )
);

module.exports = router;
