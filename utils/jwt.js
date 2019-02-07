require('dotenv').config();

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const generateAccessToken = user =>
  jwt.sign(
    {
      email: user.email,
      _id: user._id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: jwtConfig.access.expiresIn },
  );

const generateRefreshToken = user =>
  jwt.sign(
    {
      email: user.email,
      _id: user._id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: jwtConfig.refresh.expiresIn },
  );

// TODO: Нужно добавить в объект timestamp до истечения
module.exports.generateAuthTokens = user => ({
  accessToken: generateAccessToken(user),
  refreshToken: generateRefreshToken(user),
});
