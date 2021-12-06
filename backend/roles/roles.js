const jwt = require("jsonwebtoken");
const Group = require("../models/group");
const User = require("../models/user");

const authToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    req.token = token;

    // verify token
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizedData) => {
      if (err) {
        res.sendStatus(403).send("ERROR: Could not connect to the protected route");
      }
    });

    next();
  } else {
    res.sendStatus(403).send("unathorized : can't find token");
  }
}

function authSelf(req, res, next) {
  // check if he is the one who is managing his profile
}

const  authAdminOfAGroup = async (req, res, next) => {
  const { gid } = req.body;
  var uid;

  // get token
  const header = req.headers["authorization"];
  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];
    var decoded;

    // check token
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).send("unauthorized : bad token");
    }

    // find user
    uid = decoded.data;
    let user;
    try {
      user = await User.findById(uid);
    } catch (error) {
      return next(
        new Error("[ERROR][ROLE] Could not find user by id: " + error)
      );
    }
  } else {
    return res.sendStatus(500).send("unathorize : can't find token");
  }

  // find group
  let group;
  try {
    group = await Group.findById(gid);
  } catch (error) {
    return next(new Error('[ERROR][ROLE] Could not find group by id: ' + error));
  }

  // check if group.owner == user
  if(group.owner == uid){
    next(); 
  } else { 
    return next(new Error('[ERROR][ROLE] Unauthorized : need to be admin of the group'));
  }
}

module.exports = {
  authToken,
  authAdminOfAGroup
};
