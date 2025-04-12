const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const CompanyProfile = require("../models/CompanyProfile");
const {authMiddleware,checkRole} = require("../middleware/authMiddleware");

router.post("/company-profile", authMiddleware, checkRole('company'), async (req, res) => {
  const { salaryRange, cultureValues, aboutCompany } = req.body;
  const companyId = req.user.id;
  try {
    const updated = await CompanyProfile.findOneAndUpdate(
      { companyId:companyId  },
      { salaryRange, cultureValues, aboutCompany },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving profile" });
  }
});

router.get("/company-profile/:companyId", async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ companyId: req.params.companyId });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

router.post("/feedback", authMiddleware, async (req, res) => {
  const { candidateId, companyId, feedbackText, from } = req.body;
  try {
    const feedback = new Feedback({ candidateId, companyId, feedbackText, from });
    await feedback.save();
    res.json({ message: "Feedback submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting feedback" });
  }
});

router.get("/feedback/:companyId", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ companyId: req.params.companyId }).populate("candidateId", "name");
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching feedback" });
  }
});

module.exports = router;
