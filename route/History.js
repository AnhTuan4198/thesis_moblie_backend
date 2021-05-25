const express = require("express");
const router = express.Router();
const  {getSpecificHistory} = require('../handler/history/history');

router.get('/:history_id',getSpecificHistory);

module.exports = router;




