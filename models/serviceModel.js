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
    createdAt: {
      type: Date,
      require: false,
      default: new Date(),
    },
    createdBy: {
      type: Number,
      require: true,
    },
  },
  schemaOptions
);

const createServiceValidator = function(data) {
	const schema = Joi.object({
		serviceId: Joi.string().required(),
		availableTicker: Joi.array().required(),
		createdAt: Joi.data().required(),
		createdBy: Joi.number().required()
	})
	const result = schema.validate(data);
	return result;
}

const Service = mongoose.model("Service", serviceSchema);

module.exports = { Service, createServiceValidator };
