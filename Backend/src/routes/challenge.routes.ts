import express from 'express';
import { getChallenges } from '../controllers/challengeController';
import { submitChallenge } from '../controllers/submissionController';
const router = express.Router();

router.get('/', getChallenges);
router.post('/', submitChallenge);
export default router;