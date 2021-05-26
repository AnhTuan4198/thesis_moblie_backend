const express = require('express');
const app = express();
const cors = require('cors');
const config = require('config');
const { foodVerifyTicket } = require('./handler/serviceHandler/foodHandler');
const PORT = process.env.PORT || 3030;

app.use(cors());

require('./startup/db')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/event-hub')();

let key = config.get("privateKey");

foodVerifyTicket({
     userId:"6076780b1f44904322698076",
      serviceName:"Vesda's Kitchen",
      deviceId:"IYC3gKNUP33",
      ticketType:"Standard",
      ticketCode:"1degkp1dg1ky",
      serviceKey:"HostName=thesis-hcmut.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=NN2Pq5f9fXxWuiwzRCcV2ZhNE+8spTXK/1hEA9X/GTk=",
})


app.listen( PORT ,()=>{
    console.log("Listening on port " +PORT)
})



