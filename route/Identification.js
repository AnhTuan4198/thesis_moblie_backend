const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {identifyCustomer, storeIdentification} = require("../handler/identification");

router.post('/', identifyCustomer, storeIdentification);

module.exports = router;