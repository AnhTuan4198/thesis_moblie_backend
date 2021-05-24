const { boolean } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const historySchema = new Schema({
  serviceName: {
    type: String,
    require: true,
  },
  ticketCode: {
    type: String,
    require: true,
  },
  time: {
    type: Date,
    default: new Date(),
  },
  user: {
    type:Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  validateStatus:{
    type:Boolean
  }
});

const History = mongoose.model("History", historySchema);

module.exports = { History };
