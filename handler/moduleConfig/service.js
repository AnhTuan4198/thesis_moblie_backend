const {Service,  createServiceValidator} = require('../../models/serviceModel');

exports.getAllService = async(req, res, next) => {
	try {
		let allService = await Service.find();
		let allServiceRes = allService.map((service) => {
			return {
				serviceId: service.serviceId,
				availableTicketType: service.availableTicketType
			};
		});
		return res.status(200).send(allServiceRes);
	} catch(error) {
		return next(error);
	}
}

exports.getSpecificService = async(req, res, next) => {
	try {
		let service = await Service.findOne({serviceId: req.params.service_id}, {
			serviceId: 1,
			availableTicket: 1,
			createdBy: 1
		});
		return res.status(200).send(service);
	} catch(error) {
		return next(error);
	}
}

exports.createService = async(req, res, next) => {
	try {
		const {error} = createServiceValidator(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		let newService = await Service.create({...req.body});
		const {
			serviceId,
			availableTicket
		} = newService;
		return res.status(200).json({
			serviceId,
			availableTicket,
			createdBy
		});
	} catch (error) {
		return next(error)
	}
}

exports.updateService =  async(req, res, next) => {
	try {
		modifiedService = {...req.body};
		await Service.findOneAndUpdate({serviceId: req.params.service_id}, {$set: modifiedService}, {upsert: true});
		let updatedService = await findOne({serviceId: req.params.service_id});
		return res.status.send(updatedService);
	} catch (error) {
		return next(error);
	}
}

exports.deleteService = async(req, res, next) => {
	try {
		let serviceObj = Service.findOne({serviceId: req.params.service_id});
		await Service.deleteOne({serviceId: req.params.service_id});
		return res.status(200).send(serviceObj);
	} catch (error) {
		return next(error);
	}
}