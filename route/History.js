const express = require("express");
const router = express.Router();


router.get('/:history_id',getSpecificHistory);

module.exports = router;