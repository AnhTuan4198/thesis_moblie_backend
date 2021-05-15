const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const schemaOptions = {
  discriminatorKey: "serviceType",
};
const serviceSchema = new Schema(
  {
    serviceName: {
      type: String,
      require: true,
      unique: true,
    },
    availableTicketType: {
      type: Array,
      require: true,
    },
    updateAt:{
      type:Date,
      require:true,
      default: new Date()
    },
    createdAt: {
      type: Date,
      require: false,
      default: new Date(),
    },
    createdBy: {
      type: Number,
      require: true,
      default: 1
    },
  },
  schemaOptions
);

const createServiceValidator = function(data) {
	const schema = Joi.object({
		serviceName: Joi.string().required(),
		availableTicker: Joi.array().required(),
		createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
		createdBy: Joi.number().required()
	})
	const result = schema.validate(data);
	return result;
}

const Service = mongoose.model("Service", serviceSchema);

module.exports = { Service, createServiceValidator };
