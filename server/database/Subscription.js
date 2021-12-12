const mongoose = require('mongoose');
const subscriptionSchema = new mongoose.Schema({
    subscriberId: mongoose.Schema.Types.ObjectId,
    advId: mongoose.Schema.Types.ObjectId,
    status: {
        type: String,
        enum: ["requested", "tutor_rejected", "student_canceled", "waiting_payment", "paid", "completed", "refunded"],
        required: true
    },
    hours: Number
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;