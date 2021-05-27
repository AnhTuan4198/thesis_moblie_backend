const express = require('express');
const app = express();
const cors = require('cors');
const config = require('config');
const { foodVerifyTicket } = require('./handler/serviceHandler/foodHandler');
const { Module } = require('./models/moduleModel');
const PORT = process.env.PORT || 3030;

app.use(cors());

require('./startup/db')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/event-hub')();

let key = config.get("privateKey");


// const addModule = async(id) =>{
//     const newModule = await Module.create(
//         {moduleId:id}
//     )
//     console.log(newModule);
// }

// addModule("ujNxi266Y");
app.listen( PORT ,()=>{
    console.log("Listening on port " +PORT)
})



