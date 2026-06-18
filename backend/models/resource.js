const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'wheelchair',
        'crutches',
        'oxygen cylinder',
        'hospital bed',
        'medicines',
        'surgical equipment',
        'diagnostic equipment',
        'other',
      ],
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: ['new', 'good', 'fair', 'poor'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'claimed'],
      default: 'pending',
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: [
      {
        type: String, // image URLs
      },
    ],
    adminNote: {
      type: String, // admin can add note when approving/rejecting
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);