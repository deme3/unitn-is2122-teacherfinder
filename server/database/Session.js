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

let Session = mongoose.model("Session", sessionSchema);
module.exports = Session;