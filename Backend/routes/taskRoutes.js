// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { authMiddleware } = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const User= require("../models/User");

router.post('/post-task', authMiddleware, checkRole('company'), async (req, res) => {
  const { title, description,type } = req.body;
  try {
    const task = new Task({
      companyId: req.user.id,
      title,
      description,
      type
    });
    await task.save();
    res.status(201).json({ msg: 'Task created', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error creating task' });
  }
});

router.get('/tasks', authMiddleware, checkRole('company'), async (req, res) => {
  try {
    const tasks = await Task.find({ companyId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching tasks' });
  }
});
router.get('/match-tasks', authMiddleware, checkRole('candidate'), async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const tasks = await Task.find();
  
      const matchedTasks = tasks.map(task => {
        const matchScore = user.skills.includes(task.type) ? 90 : 30;
        return { ...task._doc, matchScore };
      });
  
      res.json(matchedTasks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Error matching tasks' });
    }
  });
  

module.exports = router;
