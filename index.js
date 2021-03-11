const express = require('express');
const app = express();
const config = require('config');
const PORT = process.env.PORT || 3030;

require('./startup/db')();
require('./startup/config')();
require('./startup/routes')(app);


let key = config.get("privateKey");
console.log(key);
app.listen( PORT ,()=>{
    console.log("listenning on port " +PORT)
})



