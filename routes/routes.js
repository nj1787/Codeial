const express = require("express");

const router = express.Router();

const homeController = require("../controllers/home_controller");

// console.log(`Router Loaded`);

router.get("/", homeController.home);
router.use("/users", require("./usersRoutes"));
router.use("/posts", require("./postsRoutes"));
router.use("/comments", require("./commentsRoutes"));
router.use("/api", require("./api"));
router.use("/likes", require("./likesRoutes"));

//for any further routes, access from here
//router.use('/routerName', require('./routerFile.js))

module.exports = router;
