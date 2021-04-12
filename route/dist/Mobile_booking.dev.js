"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../handler/booking/mobile_booking"),
    booking = _require.booking;

router.post("/mobile_booking", booking);
module.exports = router;