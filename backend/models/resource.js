const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: String,

  category: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    default: 1
  },

  condition: {
    type: String,
    enum: ["new", "good", "used"],
    default: "good"
  },

  status: {
    type: String,
    enum: ["available", "requested", "donated"],
    default: "available"
  },

  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Resource", resourceSchema);
