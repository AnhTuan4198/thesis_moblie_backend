const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { enrollmentRegister, deviceRegister } = require("../handler/IotHubRegister");
const { addModule, getAllModules} = require("../handler/module");

router.post('/register', addModule);

router.get('/', getAllModules);

router.get('/iot-hub-registration',enrollmentRegister,deviceRegister)

module.exports = router;