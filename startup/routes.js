const express = require("express");
const userRoute = require("../route/User");
const moduleRoute = require("../route/Module");
const errorHandler = require("../handler/error");
const bookingRoute = require('../route/Mobile_booking'); 
const ticketRoute = require('../route/Tickets');
const movieRoute = require("../route/Movie");
const foodRoute = require("../route/Food");
const historyRoute = require('../route/History')

const serviceRoute = require("../route/Service");

module.exports = function (app) {
	app.use(express.json());

	app.use('/api/tickets',ticketRoute)
	// all route for user
	app.use("/auth", userRoute);

	app.use("/api/services", serviceRoute);

	// route for IoT device
	app.use("/api/modules", moduleRoute);

	// route for sending code

	app.use("/booking",bookingRoute)
	app.use("/movie", movieRoute);
	app.use("/food", foodRoute);
	app.use("/history",historyRoute);
	//app error handler
	app.use(errorHandler);
}