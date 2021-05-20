const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieSchema = new Schema({
	movieName: {
		type: String,
		require: true
	},
	performanceTime: {
		type: Date,
		require: true
	},
	theater: {
		type: String,
		require: true
	},
	availableSeat: {
		type: Number,
		require: true
	}
});

const createMovieValidator = function(data) {
	const schema = Joi.object({
		movieName: Joi.string().required(),
		performanceTime: Joi.date().required(),
		theater: Joi.string().required(),
		availableSeat: Joi.number().required()
	})
	const result = schema.validate(data);
	return result;
}

const Movie = mongoose.model("Movie", movieSchema);

module.exports = { Movie, createMovieValidator };
