const express = require("express");
const router = express.Router();
const { register ,signIn ,updateNotificationsToken} = require("../handler/auth");

router.post('/register',register);

router.post('/signin',signIn);

router.put('/notification_token',updateNotificationsToken);

module.exports = router;