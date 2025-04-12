const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  type: {
    type: String,
    required: true, 
  },
});

module.exports = mongoose.model('Task', taskSchema);
