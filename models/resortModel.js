const Joi = require("joi");
const mongoose = require("mongoose");
const { Service } = require("./serviceModel");
const { Schema } = mongoose;

const resortSchema = new Schema({
  serviceName: {
    type: String,
    require: true,
    ref: "Service",
  },
  resortName: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    require: false,
    default: new Date(),
  },
  updatedBy: {
    type: Number,
    require: true,
  },
});

const registerResortValidator = function (data) {
  const schema = Joi.object({
    serviceName: Joi.string().required(),
    tickerCode: Joi.string().required(),
    resortName: Joi.string.required(),
    room: Joi.string().required(),
    reportService: Joi.array(),
    createdAt: Joi.data().required(),
    createdBy: Joi.number().required(),
  });
  const result = schema.validate(data);
  return result;
};

const Resort = Service.discriminator("Resort", resortSchema);

module.exports = { Resort, registerResortValidator };
