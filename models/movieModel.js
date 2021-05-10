const Joi = require("joi");
const mongoose = require("mongoose");
const { Service } = require("./serviceModel");
const { Schema } = mongoose;

const movieSchema = new Schema({
  serviceName: {
    type: String,
    require: true,
    ref: "Service",
  },
  movieName: {
    type: String,
    require: true,
  },
  performanceTime: {
    type: Date,
    require: true,
  },
  theater: {
    type: String,
    require: true,
  },
  availableSeat: {
    type: Number,
    require: true,
  },
  createdAt: {
    type: Date,
    require: false,
    default: new Date(),
  },
  createdBy: {
    type: Number,
    require: true,
  },
});

const createMovieValidator = function (data) {
  const schema = Joi.object({
    serviceName: Joi.string().required(),
    movieName: Joi.string().required(),
    performanceTime: Joi.date().required(),
    theater: Joi.string().required(),
    availableSeat: Joi.number().required(),
    createdAt: Joi.date(),
    createdBy: Joi.number().required(),
  });
  const result = schema.validate(data);
  return result;
};

const Movie = Service.discriminator("Movie", movieSchema);

module.exports = { Movie, createMovieValidator };
