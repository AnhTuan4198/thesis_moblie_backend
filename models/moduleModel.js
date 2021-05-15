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
    type: Schema.Types.ObjectId,
    ref: "Service",
  },
  gate: {
    type: String,
    default: " ",
  },
  updateAt:{
    type: Date,
    require: false,
    default: new Date()
  },

  createdAt: {
    type: Date,
    require: false,
    default: new Date(),
  },
});

const updateModuleValidator = function (data) {
  const schema = Joi.object({
    serviceName:Joi.string().required(),
    gate: Joi.string(),
    updatedAt: Joi.date(),
  });
  const result = schema.validate(data);
  return result;
};

const Module = mongoose.model("Module", moduleSchema);

module.exports = { Module, updateModuleValidator };
