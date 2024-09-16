// const mongoose = require('mongoose');

// const articleSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   abstract: { type: String, required: true },
//   content: { type: String},
//   file: { type: String },
//   status: { type: String, enum: ['submitted', 'under review', 'accepted', 'rejected'], default: 'submitted' },
//   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   reviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  

// },{ timestamps: true } );

// module.exports = mongoose.model('Article', articleSchema);
const { DataTypes } = require('sequelize');
const sequelize = require('../db');  // Import sequelize instance
const User = require('./User');  // Import User model

const Article = sequelize.define('Article', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  abstract: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
  file: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('submitted', 'under review', 'accepted', 'rejected'),
    defaultValue: 'submitted',
  },
}, { timestamps: true });

// Define relations
Article.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
Article.belongsToMany(User, { as: 'reviewers', through: 'ArticleReviewers', foreignKey: 'articleId' });

module.exports = Article;
