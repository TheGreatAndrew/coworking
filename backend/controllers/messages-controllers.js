const mongoose = require('mongoose');

// Local Imports
const Message = require('../models/message');
const Group = require('../models/group');
const User = require('../models/user');

const fetchMessages = async (req, res, next) => {
  const gid = req.params.gid;

  if (!gid) return next(new Error('[ERROR][MESSAGES] wrong group id: '));

  // Find group's messages
  let group;
  try {
    group = await Group.findById(gid).populate('messages');
  } catch (error) {
    return next(new Error('[ERROR][MESSAGES] Could not find group by id: ' + error));
  }

  res.json({ message: 'Messages fetched!', messages: group.messages });
};

const sendMessage = async (req, res, next) => {
  const { gid, username, text, image, uid, date } = req.body;

  // Find group
  let group;
  try {
    group = await Group.findById(gid);
  } catch (error) {
    return next(new Error('[ERROR][MESSAGES] Could not find group by id: ' + error));
  }

  // Add member
  let user;
  try {
    user = await User.findById(uid);
  } catch (error) {
    return next(new Error('[ERROR][MESSAGES] Could not find user by id: ' + error));
  }

  let isMember = false;
  for (const member of group.members) {
    if (member._id == uid) isMember = true;
  }
  if (!isMember) group.members.push(user);

  // Create message
  const newMessage = new Message({
    username,
    text,
    image,
    group,
    date
  });

  // Transaction
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newMessage.save({ session: sess });
    group.messages.push(newMessage);
    await group.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(new Error('[ERROR][MESSAGE] Message transaction failed: ', error));
  }

  // Send Response
  res.json({ message: 'Message sent!' });
};

const deleteMessage = async (req, res, next) => {

  const mid = req.params.mid;

  // if (!mid) return next(new Error('[ERROR][MESSAGES] wrong message id: '));

  // Find group's messages
  let message;
  try {
    message = await Message.findById(mid);
  } catch (error) {
    return next(new Error('[ERROR][MESSAGES] Could not find group by id: ' + error));
  }

  message.deleteOne({ _id: mid }, function(err) {
    if (!err) {
            message.type = 'notification!';
    }
    else {
            message.type = 'error';
    }
});
  res.json({ message: 'Messages Deleted!', messages: message });
};

exports.fetchMessages = fetchMessages;
exports.sendMessage = sendMessage;
exports.deleteMessage = deleteMessage;
