const Joi =  require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const config = require("config");

const identificationSchema =  new Schema({
	moduleId: {
		type: String,
		require: true,
	},
	ticketCode: {
		type: String,
		require: true
	},
	serviceId: {
		type: String,
		require: true
	},
	gate: {
		type: String,
		require: true
	},
	scannedAt: {
		type: Date,
		default: new Date()
	}
})

const identificationValidator = function(data) {
	const schema = Joi.object({
		moduleId: Joi.string().required(),
		ticketCode: Joi.string().required()
	})
	const result =  schema.validate(data);
	return result;
}

const Identification = mongoose.model('Identification', identificationSchema);

module.exports = {Identification, identificationValidator}