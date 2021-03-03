const mongoose = require("mongoose");

module.exports = function(){
    mongoose
      .connect("mongodb://localhost/thesis_app", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("connected to mongodb"))
      .catch((e) => {
        console.log(e);
      });
}