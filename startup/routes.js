
const express = require("express");
const userRoute = require("../route/User");
const errorHandler = require("../handler/error");

module.exports = function (app) {
    app.use(express.json());

    // all route for user
    app.use("/auth", userRoute);

    //app error handler
    app.use(errorHandler);
}