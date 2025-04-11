const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String, // e.g., 'python', 'java'
  input: String,
  expectedOutput: String,
  boilerplateCode: String,
});

module.exports = mongoose.model('Challenge', challengeSchema);
