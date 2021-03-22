const Joi = require("joi");
const mongoose = require("mongoose");
const {
	Schema
} = mongoose;

const foodSchema = new Schema({
	serviceId: {
		type: String,
		require: true,
		unique: true
	}
});

const createFoodValidator = function(data) {
	const schema = Joi.object({
		serviceId: Joi.string().required()
	})
	const result = schema.validate(data);
	return result;
}

const Food = mongoose.model('Food', foodSchema);

module.exports = {Food, createFoodValidator}