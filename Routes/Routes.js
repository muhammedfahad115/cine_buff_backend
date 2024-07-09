const express = require("express");
const { SignUp, Login } = require("../Controllers/UserControllers");
const router = express.Router();

router.post('/signup',SignUp);
router.post ('/login',Login);

module.exports = router;