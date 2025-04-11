import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  user: mongoose.Types.ObjectId;
  challenge: mongoose.Types.ObjectId;
  solution: string;
  output: string;
  status: string;
  isCorrect: boolean;
  submittedAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  solution: { type: String, required: true },
  output: { type: String },
  status: { type: String },
  isCorrect: { type: Boolean },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISubmission>('Submission', submissionSchema);
