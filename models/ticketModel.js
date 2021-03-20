const Joi = require("joi");
const mongoose = require("mongoose");
const {
	Schema
} = mongoose;

const TicketSchema = new Schema({
	ticketCode: {
		type: String,
		require: true,
		unique: true
	},
	role: {
		type: String,
		require: true
	},
	createdAt: {
		type: Date,
		default: new Date()
	}
})

const createTicketValidator = function(data) {
	const schema = Joi.object({
		ticketCode: Joi.string().required(),
		role: Joi.string().required()
	})
	const result = schema.validate(data);
	return result;
}

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = {Ticket}