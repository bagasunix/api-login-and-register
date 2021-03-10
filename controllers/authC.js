// Import Models
const User = require("../models/userM");
// Lib Validator
const validator = require("fastest-validator");
const v = new validator();

module.exports = {
  addUser: async (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    const schema = {
      name: "string|empty:false",
      email: "email|empty:false|min:5",
      password: "string|empty:false|min:8",
      passwordConfirm: { type: "equal", field: "password" },
    };

    const validate = v.validate(req.body, schema);

    if (validate.length) {
      return res.status(400).json({
        status: "error",
        message: validate,
      });
    }

    const CheckDup = await User.findOne({
      where: { email: email },
    });

    if (CheckDup) {
      return res.status(409).json({
        status: "error",
        message: "Email is already exist",
      });
    }

    const data = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      message: `Success Add User`,
      data: {
        name: data.name,
        email: data.email,
      },
    });
  },

  login: async (req, res, next) => {
    const { email, password } = req.body;

    // Check If Email and Password Exist
    const valid = {
      email: "email|empty:false|min:5",
      password: "string|empty:false|min:8",
    };

    const validate = v.validate(req.body, valid);

    if (validate.length) {
      return res.status(400).json({
        status: "error",
        message: validate,
      });
    }
    // Check If User Exist && Password is Correct
    const user = await User.findOne({ email }).select("+password");

    const correct = await user.correctPassword(password, user.password);

    if (!user || !correct) {
      return next(new AppErr("Incorrect Email or Password", 401));
    }

    res.status(200).json({
      status: "success",
      message: `Success Login`,
    });
  },
};
