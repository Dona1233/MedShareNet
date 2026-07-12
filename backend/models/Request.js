const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },
    beneficiary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a reason for your request'],
      trim: true,
    },
    quantityRequested: {
      type: Number,
      required: [true, 'Please specify quantity needed'],
      min: [1, 'Quantity must be at least 1'],
    },
    disclaimerAccepted: {
      type: Boolean,
      required: [true, 'Disclaimer must be accepted'],
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNote: {
      type: String,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: [true, 'Please provide delivery address'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);