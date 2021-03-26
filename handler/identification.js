const config = require("config");

const {Identification, identificationValidator} = require("../models/identificationModel");
const {Module} = require("../models/moduleModel");
const {Ticket} = require("../models/ticketModel");
const {Service} = require("../models/serviceModel");

exports.identifyCustomer = async(req, res, next) => {
	if (req.get("secret_key") != config.get("secretKey")) return next({
		message: "Unauthorize",
		statusCode: 401
	});
	const {
		error
	} = identificationValidator(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	try {
		// Checking existing module
		let existModule = await Module.findOne({
			moduleId: req.body.moduleId
		});
		if (!existModule) return next({
			message: "Module does not exist",
			statusCode: 404
		});

		// Checking existing customer's code
		let existTicket = await Ticket.findOne({
			ticketCode: req.body.ticketCode
		});
		if (!existTicket) return next({
			message: "Ticket not found",
			statusCode: 404
		});

		// Checking ticket's availability
		let currentTime = new Date();
		if (existTicket.startTime > currentTime || existTicket.endTime < currentTime) return next({
			message: "Ticket is not due or expired",
			statusCode: 403
		}) ;
		
		// Handle valid access to services of customer
		let availableService = await Service.find({
			serviceId: {$eq: existModule.serviceId},
			availableTicket: { $eq: existTicket.ticketType}
		});

		if (!availableService) return next({
			message: "Unavailable service for this user",
			statusCode: 403
		});
		res.locals = {
			serviceId: existModule.serviceId,
			gate: existModule.gate
		};
		return next();
	} catch(error) {
		return next(error);
	}
}

exports.storeIdentification = async(req, res, next) => {
	try {
		let newIdentification = await Identification.create({
			...req.body,
			...res.locals
		});
		const {
			moduleId,
			serviceId,
			gate,
			ticketCode,
			scannedAt
		} = newIdentification;
		return res.status(200).json({
			moduleId,
			serviceId,
			gate,
			ticketCode,
			scannedAt
		});	
	} catch(error) {
		return next(error);
	}
}