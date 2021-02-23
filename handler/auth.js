const { User, registerValidator,signInValidator } = require("../models/userModel");


exports.register = async (req, res, next) => {
  const { error } = registerValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let existEmail = await User.findOne({ email: req.body.email });
  if (existEmail) return res.status(400).send("User already exist");

  let existUserName = await User.findOne({ userName: req.body.userName });
  if(existUserName) return res.status(400).send("User name already exist");

  try {
    let newUser = await User.create({ ...req.body });
    const { _id, userName, email } = newUser;
    let token = newUser.generateJWToken();
    return res.status(200).json({
      _id,
      userName,
      email,
      token
    });
  } catch (error) {
    
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
        const { _id, userName, email } = user;
        let token = user.generateJWToken();
        return res.send({
          _id,
          userName,
          email,
          token,
        });

    } catch (error) {
        
    }
}

