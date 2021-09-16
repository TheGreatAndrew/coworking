// helper function for token

require('dotenv').config();

const jwt = require('jsonwebtoken');

const createToken = async id => {
  const token = await jwt.sign(
    {
      data: id
    },
    process.env.JWT_SECRET,
    { expiresIn: '72h' }
  );
  return token;
};

const checkToken = async (id, token) => {
  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken.data == id;
};

const isRevoked = async id => {

  const token = await jwt.sign(
    {
      data: id
    },
    process.env.JWT_SECRET,
    { expiresIn: '0h' }
  );
  return token;
}


exports.createToken = createToken;
exports.checkToken = checkToken;
exports.isRevoked = isRevoked;
