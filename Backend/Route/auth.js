const express = require("express");
const controller = require("../Controller/auth");
const multer = require('multer');
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/signup", controller.signup);

router.post("/login", controller.login);

router.get('/currentUser' , controller.getCurrentUser)

router.get("/users", controller.getAllUsers);

router.get("/history", controller.getHistory);

router.post('/contact',controller.postContact);

router.get('/contact/:id',controller.getContact);

router.get("/recent/:id", controller.getChat);

router.post('/logout',controller.logout)

router.post("/invite", controller.postInvite);

router.post("/upload", upload.single("ProfilePic"), controller.uploadFile);

router.put("/update-name", controller.updateName);

router.delete("/delete/:user1/:user2", controller.deleteChat);

router.put("/reset-password" ,controller.resetPassword);

module.exports = router;
