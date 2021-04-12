"use strict";

var express = require("express");

var userRoute = require("../route/User");

var moduleRoute = require("../route/Module");

var deviceTwinRoute = require("../route/DeviceTwin");

var identificationRoute = require("../route/Identification");

var errorHandler = require("../handler/error");

var bookingRoute = require('../route/Mobile_booking');

module.exports = function (app) {
  app.use(express.json()); // all route for user

  app.use("/auth", userRoute); // route for IoT device

  app.use("/module", moduleRoute); // route for sending code

  app.use("/identification", identificationRoute);
  app.use("/booking", bookingRoute); //app error handler

  app.use(errorHandler);
};