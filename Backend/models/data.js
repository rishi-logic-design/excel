// models/Data.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
