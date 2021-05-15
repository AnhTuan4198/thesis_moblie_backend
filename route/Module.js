const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { enrollmentRegister, deviceRegister } = require("../handler/moduleConfig/IotHubRegister");
const { addModule, getModules, updateModuleService} = require("../handler/moduleConfig/module");
const { updateIndividualDevice, updateDeviceService } = require("../handler/moduleConfig/device-twin");

router.get('/', getModules);

router.get('/iot-hub-registration',enrollmentRegister,deviceRegister, addModule);

// Update service for module
router.put('/:module_id/service', updateModuleService, updateDeviceService);

// Update wifi config
router.put('/:module_id/wifi', updateIndividualDevice);

module.exports = router;