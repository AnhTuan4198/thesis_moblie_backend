const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const config = require("config")

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique:true,    
    validate: {
        validator: 
            function(v) {
            return v.match(/\S+@\S+\.\S+/);
        },
        message: "Wrong email format",
    },
  },
  password: {
    type: String,
    require: true,
    min: [4, "Password at least 4 characters"],
    max: [255, "Password at most 4 characters"],
  },
  userName: {
    type: String,
    require: true,
    unique:true,
    min: [3, "Name at least 4 characters"],
    max: [32, "Name at most 4 characters"],
  },
  gender:{
      type:String,
      require:true,
      enum:["male",'female','other']
  },
  birthDay:{
      type:Date,
      require:true
  },
  address:{
      type:String
  }
});

userSchema.pre("save",async function(next) {
    try {
      if (!this.isModified("password")) {
        return next();
      }
        let hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword;
        return next()
    } catch (error) {
        return next();
    }
})

userSchema.methods.generateJWToken = function () {
  const payload = {
    _id:this._id,
    email: this.email,
    userName: this.userName,
  };   
  let token = jwt.sign(payload, config.get("privateKey"));
  
  return token;
}

userSchema.methods.comparePassword = async function ( password, next ){ 
  try {
    let isMacth  = await bcrypt.compare(password,this.password);
    // console.log(isMatch);
    return isMacth
  } catch (error) {
    return next();
  }
}


const User = mongoose.model("User",userSchema);

const registerValidator = function (data) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(32).required(),
    userName: Joi.string().min(3).max(32).required(),
    gender: Joi.required(),
  });
  const result = schema.validate(data);
  return result;
};

const signInValidator = function (data) {
   const schema = Joi.object({
     email: Joi.string().email().required(),
     password: Joi.string().min(4).max(32).required(),
   });
   const result = schema.validate(data);
   return result;
}

module.exports = {
    User,
    registerValidator,
    signInValidator,
    userSchema
}

