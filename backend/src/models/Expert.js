const mongoose = require('mongoose');

const expertSlotSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true
    },
    timeSlots: {
      type: [String],
      default: []
    }
  },
  { _id: false }
);

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    experience: {
      type: Number,
      required: true,
      min: 0
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    bio: {
      type: String,
      default: ''
    },
    slots: {
      type: [expertSlotSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expert', expertSchema);
