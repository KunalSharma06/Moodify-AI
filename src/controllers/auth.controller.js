const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const blacklistModel = require("../models/blacklist.model")
const redis = require("../config/cache");

async function registerUser(req, res) {

  console.log("Register API called");
  const { username, email, password } = req.body;

  const isAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isAlreadyExists) {
    return res.status(400).json({
      message: "User with the same email or username already exists",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token);

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  })
}


async function loginUser(req, res) {
  console.log(req.body);
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [
      { email },
      { username }
    ]
  }).select("+password");

  if (!user) {
    return res.status(400).json({
      message: "Invalid Credentials"
    })
  }

  const isPasswordRight = await bcrypt.compare(password, user.password);

  if (!isPasswordRight) {
     return res.status(400).json({
       message: "Invalid Credentials",
     });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token);

  return res.status(200).json({
    message: "User Logged In",
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  })
}

async function getMe(req, res) {
  const user = await userModel.findById(req.user.id);

  return res.status(200).json({
    message: "User fetched successfully",
    user
  });

}

async function logoutUser(req, res) {
  const token = req.cookies.token;

  res.clearCookie("token");

  await redis.set(token, Date.now().toString(), "EX", 60 * 60);

  return res.status(200).json({
    message: "Logout successfully."
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser
};
