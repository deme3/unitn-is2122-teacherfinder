const mongoose = require('mongoose');
const adSchema = new mongoose.Schema({
  authorId: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  price: Number,
  type: {
    type: String,
    enum: ["online", "offline"],
    requested: true
  },
  lat: Number,
  lon: Number
});

const Advertisement = mongoose.model("Advertisement", adSchema);
module.exports = Advertisement;