const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const moduleSchema = new Schema({
  moduleId: {
    type: String,
    require: true,
    unique: true,
  },
  serviceName: {
    type: String,
    ref: "Service",
  },
  gate: {
    type: String,
    default: " ",
  },
  createdAt: {
    type: Date,
    require: false,
    default: new Date(),
  },
});

const updateModuleValidator = function (data) {
  const schema = Joi.object({
    serviceName: Joi.string(),
    gate: Joi.string(),
  });
  const result = schema.validate(data);
  return result;
};

const Module = mongoose.model("Module", moduleSchema);

module.exports = { Module, updateModuleValidator };
