const Joi = require("joi");
const mongoose = require("mongoose");
const {
	Schema
} = mongoose;

const customerSchema = new Schema({
	customerCode: {
		type: String,
		require: true,
		unique: true
	},
	customerType: {
		type: String,
		require: true
	},
	createdAt: {
		type: Date,
		default: new Date()
	}
})

const createCustomerValidator = function(data) {
	const schema = Joi.object({
		customerCode: Joi.string().required(),
		customerType: Joi.string().required()
	})
	const result = schema.validate(data);
	return result;
}

const Customer = mongoose.model('Customer', customerSchema);

module.exports = {Customer}