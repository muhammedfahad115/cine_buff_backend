const express = require("express");
const { SignUp, Login, Profile, Xlsx } = require("../Controllers/UserControllers");
const router = express.Router();
const verifyToken = require("../Middleware/VerifyToken");

router.post('/signup',SignUp);
router.post ('/login',Login);
router.get('/profile',verifyToken, Profile);
router.get('/xlsx',Xlsx);

module.exports = router;