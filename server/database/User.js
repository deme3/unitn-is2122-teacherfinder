const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  biography: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String
});

const User = mongoose.model("User", userSchema);
module.exports = User;
