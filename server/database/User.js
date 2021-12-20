const mongoose = require("mongoose");
const Advertisement = require("./Advertisement.js");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  biography: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
});

userSchema.statics.findUserAds = async function (userId) {
  if (userId.length === 24) {
    return await Advertisement.find({ authorId: userId }).exec();
  } else {
    return [];
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
