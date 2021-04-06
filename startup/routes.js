const express = require("express");
const userRoute = require("../route/User");
const moduleRoute = require("../route/Module");
const deviceTwinRoute = require("../route/DeviceTwin")
const errorHandler = require("../handler/error");
const movieRoute = require("../route/Movie");

module.exports = function (app) {
	app.use(express.json());

	// all route for user
	app.use("/auth", userRoute);

	// route for IoT device
	app.use("/module", moduleRoute);	

	app.use("/movie", movieRoute);

	//app error handler
	app.use(errorHandler);
}