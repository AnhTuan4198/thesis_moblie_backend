const express = require("express");
const router = express.Router();
const {booking} = require("../handler/booking/mobile_booking")
router.post("/mobile",booking)

module.exports = router;