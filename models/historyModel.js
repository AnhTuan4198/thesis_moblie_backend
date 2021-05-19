const mongoose = require("mongoose");
const { Schema } = mongoose;

const historySchema = new Schema({
  serviceName: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "Service",
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
    type: Object, type: Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
});

const History = mongoose.model("History", historySchema);

module.exports = { History };
