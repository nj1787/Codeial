const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users_controller");

router.get("/profile", usersController.profile);

router.get("/signin", usersController.signIn);

router.get("/signup", usersController.signUp);

router.post("/create", usersController.create);

router.post("/createSession", usersController.createSession);

module.exports = router;
