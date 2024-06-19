const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
