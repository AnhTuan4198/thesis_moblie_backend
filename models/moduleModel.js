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
		require: true
	},
	createdAt: {
		type: Date,
		require: true,
	},
	createdBy: {
		type: Number,
		require: true
	}
});

moduleSchema.pre("save", async function(next) {
	try {
		let currentTime = new Date();
		this.createdAt = currentTime;
		return next();
	} catch (error) {
		return next();
	}
})

const registerModuleValidator = function(data) {
	const schema = Joi.object({
		moduleId: Joi.string().required(),
		serviceId: Joi.string().required(),
		createdAt: Joi.date().required(),
		createdBy: Joi.number().required()
	})
	const result = schema.validate(data);
	return result;
}

const Module = mongoose.model('Module', moduleSchema);

module.exports = {Module, registerModuleValidator}