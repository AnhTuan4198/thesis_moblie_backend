const Joi = require("joi");
const mongoose = require("mongoose");
const { Service } = require("./serviceModel")
const {
	Schema
} = mongoose;


const foodSchema = new Schema({
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
	}
});

const createFoodValidator = function(data) {
	const schema = Joi.object({
		serviceId: Joi.string().required(),
		availableTicker: Joi.array().required(),
		createdAt: Joi.data().required(),
		createdBy: Joi.number().required(),
		foodName: Joi.string().required(),
		foodKind: Joi.string().required(),
		location: Joi.string().required(),
		price: Joi.number(),
		createdAt: Joi.date(),
		createdBy: Joi.number().required()
	})
	const result = schema.validate(data);
	return result;
}


const Food = Service.discriminator('Food', foodSchema);

module.exports = {Food, createFoodValidator}