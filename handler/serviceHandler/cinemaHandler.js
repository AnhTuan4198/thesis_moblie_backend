const {Movie, createMovieValidator} = require('../../models/movieModel');
const { Service } = require('../../models/serviceModel');
const {History} = require('../../models/historyModel');
const { Ticket } = require('../../models/ticketModel');

exports.cinemaVerifyTicket = async(identificationObj) => {
	try {
		let validService = await Service.findOne({
			serviceId: {$eq: identificationObj.serviceId},
			availableTicket: { $eq: identificationObj.ticketType}
		});
		if (!validService) return next({
			message: "Unavailable service for this user",
			status: 403
		});
		// Custom implementation for movie service
		Movie.updateOne(
			{serviceId: identificationObj.serviceId}, 
			{$inc: {availableSeat: 1}}
		);
		let currentUser = await Ticket.findOne({ticketCode: identificationObj.ticketCode}).user;
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