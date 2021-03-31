const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { enrollmentRegister, deviceRegister } = require("../handler/IotHubRegister");
const { addModule, getAllModules, updateModuleService} = require("../handler/module");

router.get('/', getAllModules);

router.get('/iot-hub-registration',enrollmentRegister,deviceRegister, addModule);

router.put('/:moduleId', updateModuleService);

module.exports = router;