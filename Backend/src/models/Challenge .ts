import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  description: string;
  language: string; 
  starterCode?: string;
  expectedOutput: string;
}

const challengeSchema = new Schema<IChallenge>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, required: true },
  starterCode: { type: String },
  expectedOutput: { type: String, required: true },
});

export default mongoose.model<IChallenge>('Challenge', challengeSchema);
