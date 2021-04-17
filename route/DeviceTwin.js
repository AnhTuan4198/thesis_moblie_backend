const express = require('express');
const router = express.Router();

const {updateIndividualDevice} = require('../handler/moduleConfig/device-twin')

router.put('/individual/update',updateIndividualDevice);


module.exports = router;