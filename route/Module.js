const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { enrollmentRegister, deviceRegister } = require("../handler/moduleConfig/IotHubRegister");
const { addModule, getAllModules, updateModuleService} = require("../handler/moduleConfig/module");
const { updateIndividualDevice } = require("../handler/moduleConfig/device-twin");

router.get('/', getAllModules);

router.get('/iot-hub-registration',enrollmentRegister,deviceRegister, addModule);

// Update service for module
router.put('/service/:module_id', updateModuleService, updateIndividualDevice);

// Update wifi config
router.put('/wifi/module_id', updateIndividualDevice);

module.exports = router;