const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const foodSchema = new Schema({
	foodName: {
		type: String,
		require: true,
	},
	foodKind: {
		type: String,
		require: true,
	},
	price: {
		type: Number,
		require: true
	}
});

const createFoodValidator = function(data) {
	const schema = Joi.object({
		foodName: Joi.string().required(),
		foodKind: Joi.string().required(),
		price: Joi.number()
	})
	const result = schema.validate(data);
	return result;
}


const Food = mongoose.model("FoodItems", foodSchema);

module.exports = { Food, createFoodValidator };
