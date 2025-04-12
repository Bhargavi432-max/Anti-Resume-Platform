const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  feedbackText: {
    type: String,
    required: true
  },
  from: {
    type: String,
    enum: ["candidate", "company"],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
