const mongoose = require("mongoose");

const companyProfileSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
    unique: true
  },
  salaryRange: {
    type: String,
    required: true
  },
  cultureValues: {
    type: [String], 
    default: []
  },
  aboutCompany: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("CompanyProfile", companyProfileSchema);
