const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const {authMiddleware} = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const axios = require('axios');

// ✅ GET all challenges for candidate
router.get('/', authMiddleware, checkRole('candidate'), async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching challenges' });
  }
});

// ✅ POST challenge submission
router.post('/submit', authMiddleware, checkRole('candidate'), async (req, res) => {
  const { challengeId, submittedCode, language } = req.body;

  try {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ msg: 'Challenge not found' });

    // Prepare request for Judge0 API
    const judgeReq = {
      source_code: submittedCode,
      language_id: getJudgeLangId(language),
      stdin: challenge.input,
      expected_output: challenge.expectedOutput,
    };

    const { data } = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      judgeReq,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      }
    );

    const score = data.status?.description === 'Accepted' ? 100 : 0;

    const newSubmission = new Submission({
      userId: req.user.id,
      challengeId,
      submittedCode,
      language,
      score,
    });

    await newSubmission.save();
    res.json({ msg: 'Submission evaluated', status: data.status.description, score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error submitting challenge' });
  }
});

// Helper function
function getJudgeLangId(language) {
  const map = {
    python: 71,
    java: 62,
    c: 50,
    'c++': 54,
    javascript: 63,
  };
  return map[language.toLowerCase()];
}

module.exports = router;
