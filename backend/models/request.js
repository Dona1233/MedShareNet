const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource",
    required: true
  },

  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  message: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Request", requestSchema);