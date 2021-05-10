const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = new Schema({
  serviceName: {
    type: String,
    require: true,
    ref: "Service",
  },
  serviceLocation: {
    type: String,
    require: true,
  },
});

const createLocationValidator = function (data) {
  const schema = Joi.object({
    serviceName: Joi.string().required(),
    serviceLocation: Joi.string().required(),
  });
  const result = schema.validate(data);
  return result;
};

const Location = mongoose.model("Location", locationSchema);

module.exports = { Location, createLocationValidator };
