const jwt = require('jsonwebtoken');

function authToken(req, res, next) {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    req.token = token;

    // verify token 
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizedData) => {
      if(err){
          console.log('ERROR: Could not connect to the protected route');
          res.sendStatus(403);
      }
    })

    next();
  } else {
    res.sendStatus(403);
  }
}

function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401);
      return res.send("Not allowed");
    }

    next();
  };
}

module.exports = {
  authToken,
};
