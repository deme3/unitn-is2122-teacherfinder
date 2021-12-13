const mongoose = require('mongoose');
const Advertisement = require('./Advertisement.js');
const Session = require('./Session.js');

const subscriptionSchema = new mongoose.Schema({
  subscriberId: mongoose.Schema.Types.ObjectId,
  adId: mongoose.Schema.Types.ObjectId,
  status: {
    type: String,
    enum: ["requested", "tutor_rejected", "student_canceled", "waiting_payment", "paid", "completed", "refunded"],
    required: true
  },
  hours: Number
});

subscriptionSchema.methods.canUpdateStatus = function(to) {
  let from = this.status;
  return (
    from == "requested" &&
      (to == "tutor_rejected" || to == "student_canceled" || to == "waiting_payment")
  )
  || (from == "waiting_payment" && to == "paid")
  || (from == "paid" && to == "completed")
  || (from == "completed" && to == "refunded");
};

subscriptionSchema.methods.getAdObject = async function() {
  return await Advertisement.findById(this.adId);
};

subscriptionSchema.methods.isOwner = async function(against) {
  let advertisement = await this.getAdObject();

  if (advertisement.authorId.toString() == against) return true;
  else return false;
};

subscriptionSchema.methods.isSubscriber = async function(against) {
  return this.subscriberId.toString() == against;
}

subscriptionSchema.methods.updateStatus = async function(sessionToken, ipAddress, newStatus) {
  let requesterId = await Session.getUserBySession(sessionToken, ipAddress);
  const TUTOR_EXCLUSIVES = ["tutor_rejected", "waiting_payment"];
  const STUDENT_EXCLUSIVES = ["requested", "paid", "completed", "student_canceled"];

  if (!this.canUpdateStatus(newStatus)) {
    return {
      success: false,
      result: { currentStatus: this.status, newStatus },
    };
  }

  if (
    (TUTOR_EXCLUSIVES.includes(newStatus) && (await this.isOwner(requesterId)))
    || (STUDENT_EXCLUSIVES.includes(newStatus) && (await this.isSubscriber(requesterId)))
  ) {
    this.status = newStatus;
    await this.save();
    return { success: true, result: this };
  } else {
    return { success: false, result: { requesterId, authorId: (await this.getAdObject()).authorId, authorized: await this.isOwner(requesterId) } };
  }
}

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;