const {Resort, registerResortValidator} = require('../../models/resortModel');
const { Service } = require('../../models/serviceModel');
const { Ticket } = require('../../models/ticketModel');

exports.resortVerifyTicket = async(identificationObj) => {
	try {
		let validService = await Service.findOne({
			serviceId: {$eq: identificationObj.serviceId},
			availableTicket: { $eq: identificationObj.ticketType}
		});
		if (!validService) return next({
			message: "Unavailable service for this user",
			status: 403
		});
		// Custom implement for resort service

		let currentUser = await Ticket.findOne({ticketCode: identificationObj.ticketCode});
		// log history
		let newLog = await History.create({
			serviceId: validService.serviceId,
			serviceType: validService.serviceType,
			ticketCode: identificationObj.ticketCode,
			user: currentUser
		});
		return ;
	} catch(error) {
		return next();
	}
}

exports.roomChecking = async(identificationObj) => {
	try {
		let serviceInformation = await Resort.findOne({ticketCode: identificationObj.ticketCode});
	} catch(error) {
		return next();
	}
}