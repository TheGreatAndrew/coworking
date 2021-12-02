const { validationResult } = require("express-validator");

// Local Imports
const Group = require("../models/group");
const user = require("../models/user");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const fetchGroups = async (req, res, next) => {
  // Fetch all groups
  let groups;
  try {
    groups = await Group.find().populate("members");
  } catch (error) {
    return next(new Error("[ERROR][GROUPS] Could not fetch groups: " + error));
  }

  // Send Response
  res.json({ message: "Groups Fetched!", groups });
};

const fetchGroupData = async (req, res, next) => {
  const id = req.params.gid;

  // Fetch group by id and populate members.
  let group;
  try {
    group = await Group.findById(id).populate("members messages");
  } catch (error) {
    return next(
      new Error("[ERROR][GROUPS] Could not fetch groups by id: " + error)
    );
  }

  const members = group.members.map((item) => {
    return { _id: item._id, username: item.username, image: item.image };
  });

  // Send Response
  res.json({ message: "Group fetched!", messages: group.messages, members });
};

const createGroup = async (req, res, next) => {
  const { title, description, uid } = req.body;

  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("[ERROR][GROUPS] Invalid entries: " + error));
  }

  //
  let owner;
  try {
    owner = await User.findById(uid);
  } catch (error) {
    return next(
      new Error("[ERROR][MESSAGES] Could not find owner by id: " + error)
    );
  }

  // Create Group
  const newGroup = new Group({
    title,
    description,
    owner,
    members: [],
    messages: [],
  });
  try {
    await newGroup.save();
  } catch (error) {
    return next(
      new Error("[ERROR][GROUPS] Could not save group to DB: " + error)
    );
  }

  // Send Response
  res.json({ message: "Group Created!" });
};

const joinGroup = async (req, res, next) => {
  const gid = req.params.gid;
  const uid = req.body.uid;

  // check if group existes
  let group;
  try {
    group = await Group.findById(gid);
  } catch (error) {
    return next(
      new Error("[ERROR][MESSAGES] Could not find group by id: " + error)
    );
  }

  // check if member existes
  let user;
  try {
    user = await User.findById(uid);
  } catch (error) {
    return next(
      new Error("[ERROR][MESSAGES] Could not find user by id: " + error)
    );
  }

  // check if already member
  let isMember = false;
  for (const member of group.members) {
    if (member._id == uid) isMember = true;
  }

  // if not member,
  if (!isMember) {
    group.members.push(user);
    user.groups.push(group);
  }

  // save
  try {
    await group.save();
    await user.save();
  } catch (error) {
    return next(
      new Error(
        "[ERROR][GROUPS][USERS] Could not save group or user to DB: " + error
      )
    );
  }

  // Send Response
  res.json({ message: "Group Joined!" });
};

// TODO : check if user already in a group 
const leaveGroup = async (req, res, next) => {
  const {gid, uid} = req.params;

  // check if group existes
  let group;
  try {
    group = await Group.findById(gid);
  } catch (error) {
    return next(
      new Error("[ERROR][MESSAGES] Could not find group by id: " + error)
    );
  }

  // check if member existes
  let user;
  try {
    user = await User.findById(uid);
  } catch (error) {
    return next(
      new Error("[ERROR][GROUP] Could not find user by id: " + error)
    );
  }

  // check if already member
  let isMember = false;
  for (const member of group.members) {
    if (member._id == uid) isMember = true;
  }

  // leave
  if (isMember) {
    const indexa = group.members.indexOf(user);
    group.members.splice(indexa, 1);
    const indexb = user.groups.indexOf(group);
    user.groups.splice(indexb, 1);
  }

  // save
  try {
    await group.save();
    await user.save();
  } catch (error) {
    return next(
      new Error(
        "[ERROR][GROUPS][USERS] Could not save group or user to DB: " + error
      )
    );
  }

  // Send Response
  res.json({ message: "Group Leaved!" });
};

// const deleteGroup = async (req, res, next) => {
//   const { gid } = req.body;

//   // TODO authenticate

//   // check if group existes
//   let group;
//   try {
//     group = await Group.findById(gid);
//   } catch (error) {
//     return next(
//       new Error("[ERROR][GROUP] Could not find group by id: " + error)
//     );
//   }

//   // delete
//   try {
//     groups.deleteOne(group)
//   } catch (error) {
//     return next(
//       new Error("[ERROR][GROUP] Could not delete group " + error)
//     );
//   }

//   // save
//   // try {
//   //   await group.save();
//   // } catch (error) {
//   //   return next(
//   //     new Error("[ERROR][GROUPS][USERS] Could not save group to DB: " + error)
//   //   );
//   // }

//   // delete
//   res.json({ message: "Group Deleted!" });
// };

const kickUser = async (req, res, next) => {
  // TODO should i put all in req.body
  const gid = req.params.gid;
  const uid = req.body.uid;
};

exports.fetchGroups = fetchGroups;
exports.fetchGroupData = fetchGroupData;
exports.createGroup = createGroup;
exports.joinGroup = joinGroup;
exports.leaveGroup = leaveGroup;
// exports.deleteGroup = deleteGroup;
