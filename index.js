const express = require('express');
const app = express();
const cors = require('cors');
const config = require('config');
const { foodVerifyTicket } = require('./handler/serviceHandler/foodHandler');
const PORT = process.env.PORT || 3030;

// const {Food} = require("./models/foodModel");
// const {FoodService} =require('./models/foodServiceModel');
// const {Service} =require('./models/serviceModel');
app.use(cors());

require('./startup/db')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/event-hub')();

let key = config.get("privateKey");

// foodVerifyTicket({
//      userId:"6076780b1f44904322698076",
//       serviceName:"Vesda's Kitchen",
//       deviceId:"IYC3gKNUP33",
//       ticketType:"Gold",
//       ticketCode:"1degkp1dghr7",
//       serviceKey:"HostName=thesis-hcmut.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=NN2Pq5f9fXxWuiwzRCcV2ZhNE+8spTXK/1hEA9X/GTk=",
// })


app.listen( PORT ,()=>{
    console.log("Listening on port " +PORT)
})



