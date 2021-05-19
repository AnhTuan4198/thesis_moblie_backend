const express = require('express');
const app = express();
const cors = require('cors');
const config = require('config');
const PORT = process.env.PORT || 3030;

// const {Food} = require("./models/foodModel");
// const {FoodService} =require('./models/foodServiceModel');

app.use(cors());

require('./startup/db')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/event-hub')();

let key = config.get("privateKey");

// const test = async()=>{
    
//     const testFood=await Food.create({
//         foodName:"BanhCanhS",
//         foodType:"noodle",
//         price:100000
//     })
//     console.log(testFood);

//     const foodService = await FoodService.create({
//       serviceName: "Vesda's Kitchen12333",
//       serviceType: "Food",
//       availableTicketType:["Standard,Gold"],
//       updatedAt: new Date(),
//       createdAt: new Date(),
//     });
//     console.log(foodService)
//     const updatedFS = await FoodService.findByIdAndUpdate(foodService._id,{$push:{menu:testFood._id}},{ new: true, useFindAndModify: false });
//     console.log(updatedFS);
// }

// test();

app.listen( PORT ,()=>{
    console.log("listenning on port " +PORT)
})



