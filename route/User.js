const bcrypt = require("bcrypt");
const express = require("express");
const {User,registerValidator}  = require("../models/userModel");
const router = express.Router();
const _ = require("lodash");



router.post('/register', async(req,res,next)=>{
    const { error } = registerValidator(req.body);
    if( error ) return res.status(400).send(error.details[0].message);
    
    let existUser = await User.findOne( {email:req.body.email} );
    if(existUser) return res.status(400).send("User already exist");

    try {
        const newUser = await User.create({...req.body});
        console.log(dbResutl);
        const response = _pick(dbResutl,['email',"userName",])
        return res.send(response);
        
    } catch (e) {
        for( field in e.errors){
            console.log(e.errors[field].message);
        }
        return
    }

})


module.exports = router;