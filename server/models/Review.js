const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
// const { DataTypes } = require('sequelize');
// const sequelize = require('../db');
// const Article = require('./Article');
// const User = require('./User');

// const Review = sequelize.define('Review', {
//   content: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   rating: {
//     type: DataTypes.INTEGER,
//     validate: {
//       min: 1,
//       max: 5,
//     },
//   },
//   date: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
// });

// // Define relations
// Review.belongsTo(Article, { foreignKey: 'articleId' });
// Review.belongsTo(User, { as: 'reviewer', foreignKey: 'reviewerId' });

// module.exports = Review;
