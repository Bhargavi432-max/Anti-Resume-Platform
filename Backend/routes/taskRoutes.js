// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { authMiddleware } = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

// POST /post-task => company posts a new task
router.post('/post-task', authMiddleware, checkRole('company'), async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = new Task({
      companyId: req.user.id,
      title,
      description,
    });
    await task.save();
    res.status(201).json({ msg: 'Task created', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error creating task' });
  }
});

// GET /tasks => get all posted tasks
router.get('/tasks', authMiddleware, checkRole('company'), async (req, res) => {
  try {
    const tasks = await Task.find({ companyId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching tasks' });
  }
});

module.exports = router;
