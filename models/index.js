const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/thesis_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongodb"));
