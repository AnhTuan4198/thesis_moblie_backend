const Joi = require("joi");
const mongoose = require("mongoose");
const { Service } = require("./serviceModel");
const { Schema } = mongoose;

const resortSchema = new Schema({
	resortName: {
		type: String,
		require: true
	}
});

const registerResortValidator = function(data) {
	const schema = Joi.object({
		resortName: Joi.string.required()
	});
	const result = schema.validate(data);
	return result;
}

const Resort = Service.discriminator("Resort", resortSchema);

module.exports = { Resort, registerResortValidator };
