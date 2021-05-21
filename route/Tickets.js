const express = require("express");
const router = express.Router();
const {getTickets} = require("../handler/ticket/ticketHandler");

router.get('/',getTickets);


module.exports = router;