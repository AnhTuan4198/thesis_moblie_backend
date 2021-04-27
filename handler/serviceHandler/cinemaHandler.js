const Client = require('azure-iothub').Client;
const Message = require("azure-iot-common").Message;
const  errorHandler = require('../error');

const {Movie, createMovieValidator} = require('../../models/movieModel');
const { Service } = require('../../models/serviceModel');
const {History} = require('../../models/historyModel');
const { Ticket } = require('../../models/ticketModel');

exports.cinemaVerifyTicket = async(identificationObj) => {
	try {
		const {serviceId,deviceId,ticketCode,ticketType,serviceKey} = identificationObj;

		const service = Client.fromConnectionString(serviceKey);
		
		let validService = await Service.findOne({
			serviceId: {$eq:serviceId},
			availableTicket: { $eq: ticketType}
		});
		if (!validService) return errorHandler({
			message: "Unavailable service for this user",
			status: 403
		});
		// Custom implementation for movie service
		Movie.updateOne(
			{serviceId: serviceId}, 
			{$inc: {availableSeat: 1}}
		);
		let currentUser = await Ticket.findOne({ticketCode: ticketCode}).user;
		// log history
		let newLog = await History.create({
			serviceId: validService.serviceId,
			serviceType: validService.serviceType,
			ticketCode: identificationObj.ticketCode,
			user: currentUser
		});

		// Open connection to the device
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
		return error;
	}
}

exports.createMovie = async(req, res, next) => {
	try {
		const {error} = createMovieValidator(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		let newMovie = await Movie.create({...req.body});
		const {
			serviceId,
			movieName,
			performanceTime,
			theater,
			availableSeat,
			createdBy
		} = newMovie;
		return res.status(200).json({
			serviceId,
			movieName,
			performanceTime,
			theater,
			availableSeat,
			createdBy
		});
	} catch (error) {
		return next(error);
	}
}

exports.getAllMovie = async(req, res, next) => {
	try {
		let allMovies = await Movie.find();
		let allMovieRes = allMovies.map((movie) => {
			return {
				movieId: movie._id,
				movieName: movie.movieName
			}
		})
		return res.status(200).send(allMovieRes);
	} catch (error) {
		return next(error);
	}
}

exports.getSpecificMovie = async(req, res, next) => {
	try {
		let movie = await Movie.findOne({_id: req.params.movie_id}, {
			serviceId: 1,
			movieName: 1,
			performanceTime: 1,
			theater: 1,
			availableSeat: 1
		});
		return res.status(200).send(movie);
	} catch (error) {
		return next(error);
	}
} 

exports.updateMovie = async(req, res, next) => {
	try {
		modifiedMovie = {...req.body};
		await Movie.findOneAndUpdate({_id: req.params.movie_id}, {$set: modifiedMovie}, {upsert: true});
		let updatedMovie = await Movie.findOne({_id: req.params.movie_id});
		return res.status(200).send(updatedMovie);
	} catch (error) {
		return next(error);
	}
}

exports.deleteMovie = async(req, res, next) => {
	try {
		let movieObj = await Movie.findOne({_id: req.params.movie_id});
		await Movie.deleteOne({_id: req.params.movie_id});
		return res.status(200).send(movieObj);
	} catch (error) {
		return next(error);
	}
}