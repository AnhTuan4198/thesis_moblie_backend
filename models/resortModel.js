
const mongoose = require("mongoose");
const { Service } = require("./serviceModel");
const { Schema } = mongoose;

const resortSchema = new Schema({
	subService: [{
		type: Schema.Types.ObjectId,
		ref:"ResortService",
		require: true
	}]
});


const Resort = Service.discriminator("Resort", resortSchema);

module.exports = { Resort };
