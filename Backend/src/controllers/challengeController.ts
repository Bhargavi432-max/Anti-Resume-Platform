import { RequestHandler } from 'express';
import Challenge from '../models/Challenge ';

export const getChallenges: RequestHandler = async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch challenges' });
  }
};
