const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String, 
  input: String,
  expectedOutput: String,
  boilerplateCode: String,
  languageTag: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Challenge', challengeSchema);
