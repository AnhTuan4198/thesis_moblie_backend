const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { addModule, getAllModules} = require("../handler/module");

router.post('/register', addModule);

router.get('/', getAllModules);

module.exports = router;