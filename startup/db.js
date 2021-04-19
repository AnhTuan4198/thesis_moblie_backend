const mongoose = require("mongoose");

module.exports = function(){
    mongoose
      .connect("mongodb://db:27017/thesis_app", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("connected to mongodb"))
      .catch((e) => {
        console.log(e);
      });
}