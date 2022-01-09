const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator");
const Token = require("../models/token");

// local
const User = require('../models/user');
const { createToken } = require('../utils/token');
const { sendEmail } = require('../utils/sendEmail');

const sendPasswordResetEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ message: "Access denied, invalid Entries.", access: false });
      return next();
    }

    // Check if user with this email already exists
    let user;
    try {
      user = await User.findOne({ email });
    } catch (error) {
      return next(
        new Error("[ERROR][USERS] Could not find user with email: ", + error)
      );
    }


    // TODO get token
    // TODO error here
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
        temp = await createToken(user._id)
        token = await new Token({
            userId: user._id,
            token: temp
        }).save();
    }
    
    const link = `${process.env.REACT_APP_CLIENT_URL}/enterpassword/?uid=${user._id}&token=${token.token}`;
    await sendEmail(user.email, "Password reset", link);

    res.send("password reset link sent to your email account");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

const verifyPasswordResetEmail = async (req, res, next) => {
  const {uid, token} = req.params;
  const {password} = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ message: "Access denied, invalid Entries.", access: false });
      return next();
    }

    const user = await User.findById(uid);
    if (!user) return res.status(400).send("invalid link or expired");

    const emailToken = await Token.findOne({
        userId: uid,
        token: token,
    });
    if (!emailToken) return res.status(400).send("Invalid link or expired");


    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 8);
    user.password = hashedPassword;
    await user.save();
    await emailToken.delete();

    res.send("password reset sucessfully.");
} catch (error) {
    res.send("An error occured");
    console.log(error);
}


};

exports.sendPasswordResetEmail = sendPasswordResetEmail;
exports.verifyPasswordResetEmail = verifyPasswordResetEmail;
