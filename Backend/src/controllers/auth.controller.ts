import { Request, Response ,RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';
import generateToken from '../utils/generateToken';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isStrongPassword = (password: string): boolean => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};
export const registerUser :RequestHandler = async (req, res)=> {
  const { name, email, password, role } = req.body;
  try {
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
      }
      if (!isStrongPassword(password)) {
        res.status(400).json({
          message:
            'Password must be at least 8 characters long and include uppercase, lowercase, and a number',
        });
        return;
      }
    const existingUser = await User.findOne({ email });
    if (existingUser){
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });
    const token = generateToken(newUser._id.toString());
    res.status(201).json({
      token,
      user: { id: newUser._id, name, email, role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Register failed', error: err });
  }
};

export const loginUser:RequestHandler  = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user){
        res.status(400).json({ message: 'Invalid credentials' });
        return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }
    const token = generateToken(user._id.toString());
    res.json({
      token,
      user: { id: user._id, name: user.name, email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
};
