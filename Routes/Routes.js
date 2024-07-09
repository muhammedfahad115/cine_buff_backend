const express = require("express");
const { SignUp } = require("../Controllers/UserControllers");
const router = express.Router();

router.post('/signup',SignUp)

module.exports = router;