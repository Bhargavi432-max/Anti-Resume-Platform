const mongoose = require('mongoose');

const taskSubmissionSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submittedCode: { type: String, required: true },
  language: { type: String, required: true },
  score: { type: Number, required: true },
  status: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TaskSubmission', taskSubmissionSchema);
