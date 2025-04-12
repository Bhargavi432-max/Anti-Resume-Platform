const express = require('express');
const router = express.Router();
const TaskSubmission = require('../models/TaskSubmission');
const axios = require('axios');
const { authMiddleware } = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const User= require("../models/User");
const Task=require("../models/Task");

router.post('/submit', authMiddleware, checkRole('candidate'), async (req, res) => {
    const { taskId, submittedCode, language } = req.body;
  
    try {
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ msg: 'Task not found' });
  
      const judgeReq = {
        source_code: submittedCode,
        language_id: getJudgeLangId(language),
        stdin: '', 
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
  
      const newSubmission = new TaskSubmission({
        taskId,
        userId: req.user.id,
        submittedCode,
        language,
        score,
        status: data.status.description,
      });
  
      await newSubmission.save();
      res.json({ msg: 'Task submitted', status: data.status.description, score });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Error submitting task' });
    }
  });
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
router.get('/task-submissions', authMiddleware, checkRole('company'), async (req, res) => {
    try {
      const tasks = await Task.find({ companyId: req.user.id });
      const taskIds = tasks.map(task => task._id);
      const submissions = await TaskSubmission.find({ taskId: { $in: taskIds } })
        .populate('userId', 'name email') 
        .populate('taskId', 'title');    
  
      res.json(submissions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Error fetching submissions' });
    }
  });
router.patch('/hire/:submissionId', authMiddleware, checkRole('company'), async (req, res) => {
    try {
      const submission = await TaskSubmission.findById(req.params.submissionId)
        .populate('taskId');
  
      if (!submission) return res.status(404).json({ msg: 'Submission not found' });
  
      if (submission.taskId.companyId.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized to hire for this task' });
      }
  
      submission.status = 'hired';
      await submission.save();
  
      res.json({ msg: 'Candidate hired successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Error hiring candidate' });
    }
  });

router.get('/anonymous-submissions/:taskId', async (req, res) => {
  const { taskId } = req.params;

  try {
    const submissions = await TaskSubmission.find({ taskId })
      .select('submittedCode language score submittedAt taskId') 
      .populate('taskId', 'title');

    res.status(200).json(submissions);
  } catch (err) {
    console.error('Error fetching anonymous submissions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/task-submissions/summary', authMiddleware, checkRole('company'), async (req, res) => {
    try {
      const tasks = await Task.find({ companyId: req.user.id });
  
      const summaries = await Promise.all(
        tasks.map(async (task) => {
          const submissions = await TaskSubmission.find({ taskId: task._id });
          const total = submissions.length;
          const avgScore =
            total > 0
              ? submissions.reduce((sum, sub) => sum + sub.score, 0) / total
              : 0;
  
          return {
            taskTitle: task.title,
            taskId: task._id,
            totalSubmissions: total,
            averageScore: Math.round(avgScore),
          };
        })
      );
  
      res.json(summaries);
    } catch (err) {
      console.error('Error getting task summaries:', err);
      res.status(500).json({ msg: 'Error fetching task summaries' });
    }
  });
  

module.exports = router;
    