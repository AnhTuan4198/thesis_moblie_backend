const bcrypt = require("bcrypt");
const express = require("express");
const {User,registerValidator}  = require("../models/userModel");
const router = express.Router();
const _ = require("lodash");
const { register ,signIn } = require("../handler/auth");

router.post('/register',register);

router.post('/signin',signIn);


module.exports = router;