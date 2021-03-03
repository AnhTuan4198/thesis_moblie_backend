const express = require('express');
const app = express();
const PORT = process.env.PORT || 3030;

require('./startup/db')();
require('./startup/config')();
require('./startup/routes')(app);

app.listen( PORT ,()=>{
    console.log("listenning on port " +PORT)
})



