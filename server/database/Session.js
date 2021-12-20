const mongoose = require('mongoose');
let sessionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  ipAddress: String,
  persistent: Boolean,
}, {
  timestamps: {
    createdAt: true,
    updatedAt: false
  }
});

sessionSchema.statics.checkToken = async function(token, ipAddress) {
  // Il token è un ObjectId, di lunghezza 24 caratteri ed esadecimale
  // se non rispetto la lunghezza o uso lettere oltre la F
  // causo un CastingError fatale
  if (mongoose.isValidObjectId(token)) {
    let session = await Session.findOne({ _id: token, ipAddress }).select("-ipAddress").exec();
    if(session !== null) {
      if (session.persistent && (new Date() - session.createdAt) > (60*60*24*30*12*1000)) {
        await Session.deleteOne({ _id: token, ipAddress }).exec();
        return { exists: true, error: false, expired: true, session };
      } else {
        return { exists: true, error: false, session };
      }
    } else {
      return { exists: false, error: false };
    }
  } else {
    return { exists: false, error: true };
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
