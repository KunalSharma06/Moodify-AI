const blacklistModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");
const redis = require("../config/cache");
const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Token not provided"
    })
  }

  const isBlackListToken = await redis.get(token);

  if (isBlackListToken) {
    return res.status(401).json({
      message: "Invalid Token"
    })
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token"
    })
  }
}

module.exports = { authUser };