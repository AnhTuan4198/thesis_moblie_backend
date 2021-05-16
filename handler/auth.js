const {
  User,
  registerValidator,
  signInValidator,
} = require("../models/userModel");

exports.register = async (req, res, next) => {
  const { error } = registerValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let existEmail = await User.findOne({ email: req.body.email });
    if (existEmail)
      return next({ message: "Emaill already exist", statusCode: 400 });

    let existUserName = await User.findOne({ userName: req.body.userName });
    if (existUserName)
      return next({ message: "Username already exist", statusCode: 400 });

    let newUser = await User.create({ ...req.body });
    const { _id, userName, email } = newUser;
    let token = newUser.generateJWToken();
    return res.status(200).json({
      _id,
      userName,
      email,
      token,
    });
  } catch (error) {
    return next(error);
  }
};

exports.signIn = async (req, res, next) => {
  const { error } = signInValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    const isValid = await user.comparePassword(req.body.password);
    isValid;
    if (isValid) {
      const { _id, userName, email } = user;
      let token = user.generateJWToken();
      return res.send({
        _id,
        userName,
        email,
        token,
      });
    } else {
      return next({
        message: "Invalid email or password",
        statusCode: 401,
      });
    }
  } catch (error) {
    return next({
      message: "Invalid email or password",
      statusCode: 401,
    });
  }
};
