const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {identifyCustomer} = require("../handler/identification");

router.post('/', identifyCustomer);

module.exports = router;