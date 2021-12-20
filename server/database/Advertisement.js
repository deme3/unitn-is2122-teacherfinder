const mongoose = require('mongoose');
const Review = require("./Review.js");
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

adSchema.statics.getEnrichedAdList = async function(ads) {
  let adsIds = ads.map((x) => x._id);

  let averageRatings = await Review.aggregate().match({
      adId: { $in: adsIds },
    })
    .group({
      _id: "$adId",
      average: { $avg: "$rating" },
    });

  let enrichedList = ads.map((x) => {
    let { _id, authorId, title, description, price, type, lat, lon } = x;
    let rating =
      averageRatings.find((y) => y._id.toString() == _id)?.average ?? 0;

    rating = Math.round(rating);

    return { _id, authorId, title, description, price, type, lat, lon, rating };
  });

  return enrichedList;
};

const Advertisement = mongoose.model("Advertisement", adSchema);
module.exports = Advertisement;