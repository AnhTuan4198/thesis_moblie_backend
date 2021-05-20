const mongoose = require("mongoose");
const { Service } = require("./serviceModel");
const { Schema } = mongoose;

const cinemaServiceSchema = new Schema({
	subService:[{
        type:Schema.Types.ObjectId,
        ref:"Movie"
    }]
});


const CinemaService = Service.discriminator("Cinema", cinemacinemaServiceSchema);
module.exports = { CinemaService};
