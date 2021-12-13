const mongoose = require('mongoose');
let sessionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  ipAddress: String,
  timestamp: Date
}, {
  timestamps: {
    createdAt: true,
    updatedAt: false
  }
});

sessionSchema.statics.checkToken = async function(token, userId, ipAddress) {
  return await Session.exists({ _id: token, userId, ipAddress });
}

let Session = mongoose.model("Session", sessionSchema);
module.exports = Session;