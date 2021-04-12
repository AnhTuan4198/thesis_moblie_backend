const express = require("express");
const router = express.Router();
const { register ,signIn } = require("../handler/auth");

router.post('/register',register);

router.post('/signin',signIn)


module.exports = router;