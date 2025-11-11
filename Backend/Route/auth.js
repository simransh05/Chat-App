const express = require("express");
const controller = require("../Controller/auth");

const router = express.Router();

router.post("/signup", controller.signup);

router.post("/login", controller.login);

router.get("/users", controller.getAllUsers);

router.get("/history", controller.getHistory);

router.post('/contact',controller.postContact);

router.get('/contact/:id',controller.getContact);

router.get("/recent/:id", controller.getChat);

router.post("/invite", controller.postInvite);

router.get("/user-exists", controller.getUser);


module.exports = router;
