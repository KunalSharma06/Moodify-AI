const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema({
  token: {
    type: String,
    required: [true, "Token is required"],
    unique: [true],
  }
}, {
  timestamps: true,
});

const blacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = blacklistModel;