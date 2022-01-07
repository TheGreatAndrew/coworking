const { validationResult } = require("express-validator");

// local
const User = require('../models/user');
const { createToken } = require('../utils/token');
const { sendEmail } = require('../utils/sendEmail');

const sendPasswordResetEmail = async (req, res, next) => {
  const { email } = req.body;
  console.log("hello password" + email);

  try {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ message: "Access denied, invalid Entries.", access: false });
      return next();
    }
    console.log("hello password" + email);

    // Check if user with this email already exists
    try {
      user = await User.findOne({ email });
    } catch (error) {
      return next(
        new Error("[ERROR][USERS] Could not find user with email: ", +error)
      );
    }

    // console.log("hello password" + user);

    // TODO get token
    let token = await createToken(user.id);

    // const link = `${process.env.REACT_APP_MY_HEROKU_BACKEND_URL}/passwords/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", "aaaaaaaaaaaaaaa");

    res.send("password reset link sent to your email account");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

const verifyPasswordResetEmail = async (req, res, next) => {};

exports.sendPasswordResetEmail = sendPasswordResetEmail;
exports.verifyPasswordResetEmail = verifyPasswordResetEmail;
