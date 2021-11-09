const { validationResult } = require('express-validator');

// Local Imports
const Group = require('../models/group');
const User = require('../models/user');

const fetchGroups = async (req, res, next) => {
  // Fetch all groups
  let groups;
  try {
    groups = await Group.find().populate('members');
  } catch (error) {
    return next(new Error('[ERROR][GROUPS] Could not fetch groups: ' + error));
  }

  // Send Response
  res.json({ message: 'Groups Fetched!', groups });
};

const fetchGroupData = async (req, res, next) => {
  const id = req.params.gid;

  // Fetch group by id and populate members.
  let group;
  try {
    group = await Group.findById(id).populate('members messages');
  } catch (error) {
    return next(new Error('[ERROR][GROUPS] Could not fetch groups by id: ' + error));
  }

  const members = group.members.map(item => {
    return { _id: item._id, username: item.username, image: item.image };
  });

  // Send Response
  res.json({ message: 'Group fetched!', messages: group.messages, members });
};

const createGroup = async (req, res, next) => {
  const { title, description, uid } = req.body;

  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error('[ERROR][GROUPS] Invalid entries: ' + error));
  }

  // 
  let owner;
  try {
    owner = await User.findById(uid);
  } catch (error) {
    return next(new Error('[ERROR][MESSAGES] Could not find owner by id: ' + error));
  }

  // Create Group
  const newGroup = new Group({ title, description, owner, members: [], messages: [] });
  try {
    await newGroup.save();
  } catch (error) {
    return next(new Error('[ERROR][GROUPS] Could not save group to DB: ' + error));
  }

  // Send Response
  res.json({ message: 'Group Created!' });
};

exports.fetchGroups = fetchGroups;
exports.fetchGroupData = fetchGroupData;
exports.createGroup = createGroup;
