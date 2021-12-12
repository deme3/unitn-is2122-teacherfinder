const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    authorId: mongoose.Schema.Types.ObjectId,
    advId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    explanation: String
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;