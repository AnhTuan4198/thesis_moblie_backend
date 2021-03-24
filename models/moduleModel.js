const Joi = require("joi");
const mongoose = require("mongoose");
const {
	Schema
} = mongoose;

const moduleSchema = new Schema({
	moduleId: {
		type: String,
		require: true,
		unique: true
	},
	serviceId: {
		type: String,
		require: false,
		default: " "
	},
	gate: {
		type: Number,
		default: 0
	},
	createdAt: {
		type: Date,
		require: false,
		default: new Date()
	},
	createdBy: {
		type: Number,
		require: true
	}
});

const registerModuleValidator = function(data) {
	const schema = Joi.object({
		moduleId: Joi.string().required(),
		createdBy: Joi.number().required()
	})
	const result = schema.validate(data);
	return result;
}

const Module = mongoose.model('Module', moduleSchema);

module.exports = {Module, registerModuleValidator}