const { User, registerValidator,signInValidator } = require("../models/userModel");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");

exports.register = async (req, res, next) => {
  const { error } = registerValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let existUser = await User.findOne({ email: req.body.email });
  if (existUser) return res.status(400).send("User already exist");

  if(req.body.userName === existUse.userName) return res.status(400).send("User name already exist");


  try {
    await User.create({ ...req.body });
    
    let token = user.generateJWToken();
    return res.send(token);
  } catch (e) {
    for (field in e.errors) {
      console.log(e.errors[field].message);
    }
    return;
  }
};

exports.signIn= async (req,res,next) => {
    const {error} = signInValidator(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let user  = await User.findOne({
            email:req.body.email
        })
        const isValid = user.comparePassword(req.body.password);
        if(!isValid) return res.status(401).send("email or password incorrect!");

        let token = user.generateJWToken();
        return res.send(token)

    } catch (error) {
        
    }
}

