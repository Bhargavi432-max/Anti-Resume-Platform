const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: 'Invalid email format' });
    }
  
    if (!validator.isStrongPassword(password, { minLength: 6 })) {
      return res.status(400).json({
        msg: 'Password must be at least 6 characters and include a number, symbol, uppercase, and lowercase letter',
      });
    }
  
    if (!['candidate', 'company'].includes(role)) {
      return res.status(400).json({ msg: 'Role must be either candidate or company' });
    }
  
    try {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ msg: 'User already exists' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();
  
      res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }
  
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: 'Invalid email format' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
  
      res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
module.exports = { register, login };
