const Client = require('azure-iothub').Client;
const Message = require("azure-iot-common").Message;
const  errorHandler = require('../error');


const {Food, createFoodValidator} = require('../../models/foodModel');
const { Service } = require('../../models/serviceModel');

exports.foodVerifyTicket = async(identificationObj) => {
	try {

		const {serviceId,deviceId,ticketCode,ticketType,serviceKey} = identificationObj;

		const service = Client.fromConnectionString(serviceKey);

		let validService = await Service.findOne({
			serviceId: {$eq: serviceId},
			availableTicket: { $eq: ticketType}
		});
		if (!validService) return errorHandler({
			message: "Unavailable service for this user",
			status: 403
		});
		// Custom implement for food service
		
		let currentUser = await Ticket.findOne({ticketCode: ticketCode}).user;
		// log history
		let newLog = await History.create({
			serviceId: validService.serviceId,
			serviceType: validService.serviceType,
			ticketCode:ticketCode,
			user: currentUser
		});

		service.open(function (err){	
			if(err){
				return errorHandler({
					message:"Cannot connect to device" + err.message
				})
			}else{
				const message = new Message(
					JSON.stringify({
						message: "Validate success!",
						open:true
					})
				)
				service.send(deviceId,message,function (err) {
					if(err){
						console.log(`message sent `)
						return err.toString();
					}
					else{
						console.log("message sent: "+message.getData())
						// process.exit(0)
						return newLog
					}
				})
			}
		})
	} catch(error) {
		return next();
	}
}

exports.createFood = async(req, res, next) => {
	try {
		const {error} = createFoodValidator(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		let newFood = await Food.create({...req.body});
		const {
			serviceId,
			foodName,
			foodKind,
			location,
			price,
			createdBy
		} = newFood;
		return res.status(200).json({
			serviceId,
			foodName,
			foodKind,
			location,
			price,
			createdBy
		});
	} catch (error) {
		return next(error);
	}
}

exports.getAllFood = async(req, res, next) => {
	try {
		let allFood = await Food.find();
		let allFoodRes = allFood.map((food) => {
			return {
				foodId: food._id,
				foodName: food.foodName
			}
		})
		return res.status(200).send(allFoodRes);
	} catch (error) {
		return next(error);
	}
}

exports.getSpecificFood = async(req, res, next) => {
	try {
		let food = await Food.findOne({_id: req.params.food_id}, {
			serviceId: 1,
			foodName: 1,
			foodKind: 1,
			location: 1,
			price: 1
		});
		return res.status(200).send(food);
	} catch (error) {
		return next(error);
	}
}

exports.updateFood = async(req, res, next) => {
	try {
		modifiedFood = {...req.body};
		await Food.findOneAndUpdate({_id: req.params.food_id}, {$set: modifiedFood}, {upsert: true});
		let updatedFood = await Food.findOne({_id: req.params.food_id});
		return res.status(200).send(updatedFood);
	} catch (error) {
		return next(error);
	}
}

exports.deleteFood = async(req, res, next) => {
	try {
		let foodObj = await Food.findOne({_id: req.params.food_id});
		await Food.deleteOne({_id: req.params.food_id});
		return res.status(200).send(foodObj);
	} catch (error) {
		return next(error);
	}
}