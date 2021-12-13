const mongoose = require('mongoose');
let sessionSchema = new mongoose.Schema({
  ipAddress: String
});

let Session = mongoose.model("Session", sessionSchema);
module.exports = Session;