const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  hashPassword: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  refreshToken: {
    type: String,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
