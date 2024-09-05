const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  content: { type: String},
  file: { type: String },
  status: { type: String, enum: ['submitted', 'under review', 'accepted', 'rejected'], default: 'submitted' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  

},{ timestamps: true } );

module.exports = mongoose.model('Article', articleSchema);
