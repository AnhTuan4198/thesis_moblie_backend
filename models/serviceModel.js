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
    location:{
        type:String,
        require:true
    }
  },
  schemaOptions
);

const createServiceValidator = function(data) {
	const schema = Joi.object({
		serviceName: Joi.string().required(),
		serviceType: Joi.string(),
		availableTicketType: Joi.array().required(),
    location:Joi.string().required(),
	})
	const result = schema.validate(data);
	return result;
}

const Service = mongoose.model("Service", serviceSchema);



module.exports = { Service, createServiceValidator };
