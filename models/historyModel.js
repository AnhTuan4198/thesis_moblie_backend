const mongoose = require("mongoose");
const { Schema } = mongoose;

const historySchema = new Schema({
  serviceName: {
    type: String,
    require: true,
    ref: "Service",
  },
  serviceType: {
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
    type: Object,
  },
});

const History = mongoose.model("History", historySchema);

module.exports = { History };
