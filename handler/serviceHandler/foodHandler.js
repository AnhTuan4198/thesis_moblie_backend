const {Food, createFoodValidator} = require('../../models/foodModel');
const { Service } = require('../../models/serviceModel');

exports.foodVerifyTicket = async(identificationObj) => {
	try {
		let validService = await Service.findOne({
			serviceId: {$eq: identificationObj.serviceId},
			availableTicket: { $eq: identificationObj.ticketType}
		});
		if (!validService) return next({
			message: "Unavailable service for this user",
			status: 403
		});
		// Custom implement for food service
		
		let currentUser = await Ticket.findOne({ticketCode: identificationObj.ticketCode}).user;
		// log history
		let newLog = await History.create({
			serviceId: validService.serviceId,
			serviceType: validService.serviceType,
			ticketCode: identificationObj,ticketCode,
			user: currentUser
		});
		return newLog;
	} catch(error) {
		return next();
	}
}