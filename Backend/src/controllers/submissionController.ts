import { RequestHandler } from 'express';
import Challenge from '../models/Challenge ';
import Submission from '../models/Submission';
import runCode from '../utils/runCode';

export const submitChallenge: RequestHandler = async (req, res) => {
  const { challengeId, solution } = req.body;
  const userId = req.user?.id;

  try {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    const languageId = languageMap[challenge.language];
    const result = await runCode(solution, languageId, challenge.expectedOutput);

    const isCorrect = result.status.description === 'Accepted';

    const submission = await Submission.create({
      user: userId,
      challenge: challengeId,
      solution,
      output: result.stdout,
      status: result.status.description,
      isCorrect,
    });

    res.status(201).json({
      message: isCorrect ? 'Correct!' : 'Incorrect',
      isCorrect,
      output: result.stdout,
      submission,
    });
  } catch (err) {
    res.status(500).json({ message: 'Submission failed', error: err });
  }
};
