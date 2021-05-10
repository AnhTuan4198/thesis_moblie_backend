const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {getAllService, getSpecificService, createService, updateService, deleteService} = require("../handler/moduleConfig/service");

router.get("/", getAllService);

router.get("/:service_id", getSpecificService);

router.post("/", createService);

router.put("/:service_id", updateService);

router.delete("/:service_id", deleteService);

module.exports = router;