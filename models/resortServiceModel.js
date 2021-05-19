const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const resortServiceSchema = new Schema({
	resortServiceName: {
		type: String,
		require: true,
	},
	price: {
		type: Number,
		require: true
	}
});



const ResortService = mongoose.model("ResortService", resortServiceSchema);

module.exports = { ResortService, createFoodValidator };
