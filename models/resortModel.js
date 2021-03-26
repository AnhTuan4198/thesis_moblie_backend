const Joi = require("joi");
const mongoose = require("mongoose");
const {
	Schema
} = mongoose;

const resortSchema = new Schema({
	serviceId: {
		type: String,
		require: true
	},
	ticketCode: {
		type: String,
		require: true
	},
	resortName: {
		type: String,
		require: true
	},
	room: {
		type: String,
		require: true
	},
	resortService: {
		type: Array
	},
	createdAt: {
		type: Date,
		require: false,
		default: new Date()
	},
	updatedBy: {
		type: Number,
		require: true
	}
});

const registerResortValidator = function(data) {
	const schema = Joi.object({
		serviceId: Joi.string().required(),
		tickerCode: Joi.string().required(),
		resortName: Joi.string.required(),
		room: Joi.string().required(),
		reportService: Joi.array(),
		createdAt: Joi.data().required(),
		createdBy: Joi.number().required()
	})
	const result = schema.validate(data);
	return result;
}

const Resort = mongoose.model('Resort', resortSchema);

module.exports = {Resort, registerResortValidator}