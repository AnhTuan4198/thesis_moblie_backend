const Joi = require("joi");
const mongoose = require("mongoose");
const {
	Schema
} = mongoose;

const locationSchema = new Schema({
	serviceId: {
		type: String,
		require: true
	},
	serviceLocation: {
		type: String,
		require: true
	}
});

const createLocationValidator = function(data) {
	const schema = Joi.object({
		serviceId: Joi.string().required(),
		serviceLocation: Joi.string().required(),
	})
	const result = schema.validate(data);
	return result;
}

const Location = mongoose.model('Location', locationSchema);

module.exports = {Location, createLocationValidator}