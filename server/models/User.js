const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["author", "editor", "reviewer"], required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  affiliation: { type: String, required: true },
  bio: { type: String },
  isApproved: { type: Boolean, default: false },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
// const { DataTypes } = require('sequelize');
// const sequelize = require('../db');
// const bcrypt = require('bcryptjs');

// const User = sequelize.define('User', {
//   username: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   role: {
//     type: DataTypes.ENUM('author', 'editor', 'reviewer'),
//     allowNull: false,
//   },
//   firstName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   lastName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   affiliation: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   bio: {
//     type: DataTypes.TEXT,
//   },
//   isApproved: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
// });

// // Hash password before saving
// User.beforeCreate(async (user) => {
//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt);
// });

// module.exports = User;
