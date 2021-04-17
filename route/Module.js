const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { enrollmentRegister, deviceRegister } = require("../handler/moduleConfig/IotHubRegister");
const { addModule, getAllModules, updateModuleService} = require("../handler/moduleConfig/module");
const { updateIndividualDevice } = require("../handler/moduleConfig/device-twin");

router.get('/', getAllModules);

router.get('/iot-hub-registration',enrollmentRegister,deviceRegister, addModule);

router.put('/:module_id', updateModuleService, updateIndividualDevice);

module.exports = router;