const express = require("express");
const userRoute = require("../route/User");
const moduleRoute = require("../route/Module");
const deviceTwinRoute = require("../route/DeviceTwin")
const identificationRoute = require("../route/Identification");
const errorHandler = require("../handler/error");
const bookingRoute = require('../route/Mobile_booking'); 


module.exports = function (app) {
	app.use(express.json());

	// all route for user
	app.use("/auth", userRoute);

	// route for IoT device
	app.use("/module", moduleRoute);

	// route for sending code
	app.use("/identification", identificationRoute);
	app.use("/booking",bookingRoute)
	//app error handler
	app.use(errorHandler);
}