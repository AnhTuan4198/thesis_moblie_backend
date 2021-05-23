const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {getAllService, getSpecificService, createService, updateService, deleteService,mobileQueryService} = require("../handler/moduleConfig/service");
const { getTickets } = require("../handler/ticket/ticketHandler");

router.get("/", getAllService);

router.get("/available_services",mobileQueryService);

router.get("/:service_id", getSpecificService);

router.post("/", createService);

router.put("/:service_id", updateService);

router.delete("/:service_id", deleteService);



module.exports = router;