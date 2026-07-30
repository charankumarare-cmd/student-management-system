import User from '../models/User.js';
import { generateToken } from '../config/jwt.js';
import { getIsInMemory } from '../config/db.js';
import { mockData } from '../utils/mockStore.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (getIsInMemory()) {
      const existing = mockData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email,
        password: hashedPassword,
        role: role || 'student',
        phone: phone || '',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      mockData.users.push(newUser);
      const token = generateToken(newUser._id, newUser.role);
      return res.status(201).json({
        token,
        user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, avatar: newUser.avatar }
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role, phone });
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (getIsInMemory()) {
      const user = mockData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = generateToken(user._id, user.role);
      return res.json({
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone }
      });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role);
      return res.json({
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone }
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (getIsInMemory()) {
      const user = mockData.users.find(u => u._id === req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  res.json({ message: 'Password reset instructions sent to your email.' });
};

export const resetPassword = async (req, res) => {
  res.json({ message: 'Password has been reset successfully.' });
};
