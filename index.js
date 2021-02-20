const express = require('express');
const app = express();
const PORT = process.env.PORT || 3030;
const config = require("config");
const mongoose = require("mongoose");
const userRoute = require("./route/User");

if(!config.get("privateKey")){
  console.log("FATAL ERROR: privateKey is not defined ");
  process.exit(1)
}

mongoose
  .connect("mongodb://localhost/thesis_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongodb"))
  .catch((e)=>{
      console.log(e);
  })

app.use(express.json());

// all route for user
app.use('/user',userRoute);










app.listen( PORT ,()=>{
    console.log("listenning on port " +PORT)
    // console.log(userRoute);
})



