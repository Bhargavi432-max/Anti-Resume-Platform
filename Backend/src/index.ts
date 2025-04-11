import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import router from "./routes/challenge.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("Hello World!");
});
app.use('/api/auth', authRoutes);
app.use('/api/challenges', router);
app.use('/api/submit-challenge', router);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));