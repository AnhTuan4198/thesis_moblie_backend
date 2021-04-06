const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {getAllMovie, getSpecificMovie, createMovie, updateMovie, deleteMovie} = require("../handler/serviceHandler/cinemaHandler");

router.get('/', getAllMovie);

router.get('/:movie_id', getSpecificMovie);

router.post('/', createMovie);

router.put('/:movie_id', updateMovie);

router.delete('/:movie_id', deleteMovie);

module.exports = router;