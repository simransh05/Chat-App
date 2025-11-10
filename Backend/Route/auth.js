const express = require("express");
const controller = require("../Controller/auth");

const router = express.Router();

router.post("/signup", controller.signup);

router.post("/login", controller.login);

router.get("/users", controller.getAllUsers);

router.get("/history", controller.getHistory);

module.exports = router;
