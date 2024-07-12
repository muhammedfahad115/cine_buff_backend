const express = require("express");
const { SignUp, Login, Profile, Xlsx } = require("../Controllers/UserControllers");
const router = express.Router();
const verifyToken = require("../Middleware/VerifyToken");
const { AddRationale, getUsers } = require("../Controllers/AdminControllers");

router.post('/signup',SignUp);
router.post ('/login',Login);
router.get('/profile',verifyToken, Profile);
router.get('/xlsx',Xlsx);
router.post('/addrationale',verifyToken, AddRationale);
router.get('/getusers',verifyToken, getUsers);

module.exports = router;