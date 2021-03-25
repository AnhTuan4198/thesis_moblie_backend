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
	},
	foodName: {
		type: String,
		require: true,
	},
	foodKind: {
		type: String,
		require: true,
	},
	location: {
		type: String,
		require: true
	},
	price: {
		type: Number,
		require: true
	},
	createdAt: {
		type: Date,
		default: new Date()
	},
	createdBy: {
		type: Number,
		require: true
	}
});

const createFoodValidator = function(data) {
	const schema = Joi.object({
		serviceId: Joi.string().required(),
		foodName: Joi.string().required(),
		foodKind: Joi.string().required(),
		location: Joi.string().required(),
		createdAt: Joi.date(),
		createdBy: Joi.number().required()
	})
	const result = schema.validate(data);
	return result;
}

const Food = mongoose.model('Food', foodSchema);

module.exports = {Food, createFoodValidator}