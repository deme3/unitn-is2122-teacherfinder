const mongoose = require('mongoose');
let sessionSchema = new mongoose.Schema({
  ipAddress: String,
  timestamp: Date
}, {
  timestamps: {
    createdAt: true,
    updatedAt: false
  }
});

sessionSchema.statics.checkToken = async function(token, ipAddress) {
  return await Session.exists({ _id: token, ipAddress });
}

let Session = mongoose.model("Session", sessionSchema);
module.exports = Session;