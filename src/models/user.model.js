const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true]
  },
  password: {
    type: String,
    required: [true, "Username is required"],
    select: false,
  }
})


const userModel = mongoose.model("users", userSchema);

module.exports = userModel;