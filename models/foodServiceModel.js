
const mongoose = require("mongoose");
const { Service } = require("./serviceModel");
const { Schema } = mongoose;

const foodServiceSchema = new Schema({
	subService:[{
        type:Schema.Types.ObjectId,
        ref:"FoodItems"
    }]
});


const FoodService = Service.discriminator("Food", foodServiceSchema);

module.exports = { FoodService};
