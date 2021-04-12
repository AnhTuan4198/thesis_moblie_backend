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
	ticketType: {
		type: String,
		require: true
	},
	startTime: {
		type: Date,
		require: true
	},
	endTime: {
		type: Date,
		require: true
	}
})

const createTicketValidator = function(data) {
	const schema = Joi.object({
		ticketCode: Joi.string().required(),
		ticketType: Joi.string().required(),
		startTime: Joi.date().required(),
		endTime: Joi.date().required()
	})
	const result = schema.validate(data);
	return result;
}

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = {Ticket,createTicketValidator}