const Joi =  require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const config = require("config");

const identificationSchema =  new Schema({
	moduleId: {
		type: String,
		require: true,
	},
	customerCode: {
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
		customerCode: Joi.string().required(),
	})
	const result =  schema.validate(data);
	return result;
}

const Identification = mongoose.model('Identification', identificationSchema);

module.exports = {Identification, identificationValidator}