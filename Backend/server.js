const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const taskSubmissionRoute = require("./routes/taskSubmissionRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use('/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api', taskRoutes);
app.use('/api', taskSubmissionRoute);
app.use("/api", feedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
