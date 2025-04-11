import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string; 
  name: string;
  email: string;
  password: string;
  role: 'candidate' | 'company';
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'company'], required: true },
});

export default mongoose.model<IUser>('User', userSchema);
