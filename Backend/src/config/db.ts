import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL! as string);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
export default connectDB;