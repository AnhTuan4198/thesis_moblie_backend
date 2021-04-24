const express = require('express');
const app = express();
const config = require('config');
const PORT = process.env.PORT || 3030;

require('./startup/db')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/event-hub')();

let key = config.get("privateKey");
    
app.listen( PORT ,()=>{
    console.log("listenning on port " +PORT)
})



