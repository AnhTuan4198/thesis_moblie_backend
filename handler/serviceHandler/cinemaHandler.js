const mongoose = require('mongoose');

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
		return newLog;
	} catch(error) {
		return next(error);
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
		return res.status(200).send(allMovies);
	} catch (error) {
		return next(error);
	}
}

exports.getSpecificMovie = async(req, res, next) => {
	try {
		let movie = await Movie.findOne({_id: req.params.movie_id});
		return res.status(200).send(movie);
	} catch (error) {
		return next(error);
	}
} 

exports.updateMovie = async(req, res, next) => {
	try {
		let movieObj = await Movie.findOne({_id: req.params.movie_id});
		modifiedMovie = {...req.body};
		console.log(modifiedMovie);
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