const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  nickname: String,
  biography: String,
  email: String,
  password: String,
  postedAds: [{ title: String }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
