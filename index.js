const express = require('express');
const app = express();
const cors = require('cors');
const config = require('config');
const PORT = process.env.PORT || 3030;

const {insertModules} = require('./helper/command/seedModules')
const { insertServices } = require('./helper/command/seedservice');
app.use(cors());

require('./startup/db')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/event-hub')();

let key = config.get("privateKey");

// insertModules()
// insertServices()
app.listen( PORT ,()=>{
    console.log("listenning on port " +PORT)
})



