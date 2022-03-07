const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { AvatarGenerator } = require('random-avatar-generator');
const user = require('../models/user');
const generator = new AvatarGenerator();
const Group = require("../models/group");

// Local Imports
const User = require('../models/user');
const { createToken, checkToken , revokeToken } = require('../utils/token');

const findUserWithEmail = async email => {
  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return next(new Error('[ERROR][USERS] Could not find user with email: ', +error));
  }
  return user;
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ message: 'Access denied, invalid Entries.', access: false });
    return next();
  }

  // Find User with email
  const user = await findUserWithEmail(email);
  if (!user) {
    res.json({ message: 'Access denied, incorrect Email.', access: false });
    return next();
  }

  // ban user can't login
  if(user.banned){
    res.json({
      message: 'Your Account Has Been Banned',
      access : false
    });
    return next();
  }


  // Decrypt password & Check if password is valid
  const decryptedPassword = await bcrypt.compare(password, user.password);
  if (!decryptedPassword) {
    res.json({ message: 'Access denied, incorrect Password.', access: false });
    return next();
  }

  // Create token
  let token = await createToken(user.id);

  // Send response
  res.json({
    message: '[USER][LOGIN] Access granted.',
    access: true,
    user: { id: user.id, username: user.username, image: user.image, token }
  });
};

const signup = async (req, res, next) => {
  const { email, password, username } = req.body;
  const defaultImage = generator.generateRandomAvatar();

  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ message: 'Access denied, invalid Entries.', access: false });
    return next();
  }

  // Check if user with this email already exists
  const existingUser = await findUserWithEmail(email);
  if (existingUser) {
    res.json({ message: 'Access denied, email already used.', access: false });
    return next();
  }
  // Encrypt password
  const hashedPassword = await bcrypt.hash(password, 8);

  // Create new user.
  const newUser = new User({ email, password: hashedPassword, username, image: defaultImage, banned: false, forrest : 0});
  try {
    await newUser.save();
  } catch (error) {
    return next(new Error('[ERROR][USERS] Could not save user in DB: ' + error));
  }

  // Create token
  let token = await createToken(newUser.id);

  // Send response
  res.json({
    message: '[USER][SIGNUP] Access granted.',
    access: true,
    user: { id: newUser.id, username: newUser.username, image: newUser.image, token }
  });
};

const guest = async (req, res, next) => {
  const randomUsername = `Guest${Math.floor(Math.random() * 99999) + 1}`;
  const defaultImage = generator.generateRandomAvatar();

  // Create Guest
  const newGuest = new User({ username: randomUsername, image: defaultImage });
  try {
    await newGuest.save();
  } catch (error) {
    return next(new Error('[ERROR][USERS] Could not save guest in DB: ' + error));
  }

  // Send response
  res.json({
    message: '[USER][GUEST] Access granted.',
    access: true,
    user: { id: newGuest.id, username: newGuest.username, image: newGuest.image }
  });
};

// to verify token 
const verify = async (req, res, next) => {
  const { id, token } = req.body;

  // Find user with id
  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    return next(new Error('[ERROR][USERS] Could not find user by id: ' + error));
  }

  // Verify Token
  const tokenIsValid = await checkToken(id, token);
  if (!tokenIsValid) {
    res.json({ message: '[USER][VERIFY] Access denied, invalid token.', access: false });
    return next();
  }

  // Send response
  res.json({
    message: '[USER][LOGIN] Access granted.',
    access: true,
    user: { id: user.id, username: user.username, image: user.image, token }
  });
};

const edit = async (req, res, next) => {
  const { id, username, image } = req.body;

  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error('[ERROR][USERS] Edit invalid entries: ' + error));
  }

  // Find user by id
  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    return next(new Error('[ERROR][USERS] Could not find user by id: ' + error));
  }

  // Edit username and image
  user.username = username;
  user.image = image;

  // Save changes
  try {
    await user.save();
  } catch (error) {
    return next(new Error('[ERROR][USERS] Could not save user update: ' + error));
  }

  // Send response
  res.json({
    message: '[USER][EDIT] User updated.',
    access: true,
    user: { username: user.username, image: user.image }
  });
};

// from admin, send axious request to ban user 
const banUser = async (req, res, next) => {
  const { email } = req.body;

  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ message: 'Access denied, invalid Entries.', access: false });
    return next();
  }

  // Find User with email
  const user = await findUserWithEmail(email);
  if (!user) {
    res.json({ message: 'Access denied, incorrect Email.', access: false });
    return next();
  }

  // ban user
  user.banned = true;
  try {
    await user.save();
  } catch (error) {
    return next(new Error('[ERROR][USERS] Could not ban user : ' + error));
  }

  // revoke token
  await revokeToken(user.id);

  // Send response
  res.json({
    message: '[USER][BAN] User is banned.',
    access: true,
    user: { banned : user.banned }
  }); 
}

const fetchJoinedGroups = async (req, res, next) => {
  const uid = req.params.uid;

  // check if member existes
  let user;
  try {
    user = await User.findById(uid);
  } catch (error) {
    return next(
      new Error("[ERROR][GROUP] Could not find user by id: " + error)
    );
  }

  // fetch joined groups
  const temp = await User.findById(uid).populate('groups'); 
  const groups = temp.groups;

  // Send Response
  res.json({ message: "Joined Groups Fetched!", groups });
}


const fetchForrest = async (req, res, next) => {
  const { uid } = req.params;

  // Find forrest 
  let user;
  let forrest;
  try {
    user = await User.findById(uid);
    forrest = user.forrest;
  } catch(error) {
    return next(new Error('[ERROR][MESSAGES] Could not get forrest using user id: ' + error))
  }

  res.json({
    message: 'Forrest fetched!', 
    forrest : forrest
  })

}

const incrementForrest = async (req, res, next) => {
  const { id, forrest } = req.body;

  // Find user by id
  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    return next(new Error('[ERROR][USERS] Could not find user by uid: ' + error));
  }

  // Edit forrest
  user.forrest = user.forrest + forrest;

  // Save changes
  try {
    await user.save();
  } catch (error) {
    return next(new Error('[ERROR][USERS] Could not save forrest: ' + error));
  }

  // Send response
  res.json({
    message: 'Forrest updated.',
    access: true,
    user: { forrest: user.forrest},
  });
  
}



exports.fetchForrest = fetchForrest;
exports.incrementForrest = incrementForrest;
exports.login = login;
exports.signup = signup;
exports.edit = edit;
exports.guest = guest;
exports.verify = verify;
exports.banUser = banUser;
exports.fetchJoinedGroups = fetchJoinedGroups;
