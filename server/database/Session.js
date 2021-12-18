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
  // Il token è un ObjectId, di lunghezza 24 caratteri
  // se non rispetto la lunghezza causo un CastError fatale
  if(mongoose.isValidObjectId(token)) {
    return await Session.exists({ _id: token, userId, ipAddress });
  } else {
    return false;
  }
};

sessionSchema.statics.getUserBySession = async function(token, ipAddress) {
  // Il token è un ObjectId, di lunghezza 24 caratteri
  // se non rispetto la lunghezza causo un CastError fatale
  if (!mongoose.isValidObjectId(token)) return null;

  let session = await Session.findOne({ _id: token, ipAddress }).exec();
  if (session === null) return null;
  else return session.userId;
};

let Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
