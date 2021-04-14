const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {getAllFood, getSpecificFood, createFood, updateFood, deleteFood} = require("../handler/serviceHandler/foodHandler");

router.get('/', getAllFood);

router.get('/:food_id', getSpecificFood);

router.post('/', createFood);

router.put('/:food_id', updateFood);

router.delete('/:food_id', deleteFood);

module.exports = router;