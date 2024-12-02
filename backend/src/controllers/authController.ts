import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user (password will be hashed by the pre-save middleware)
      const user = new User({
        email,
        password,
        preferences: {
          theme: 'light',
          notifications: true,
        },
      });

      await user.save();

      res.status(201).json({ message: 'User created successfully' });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error registering user', error: error.message || 'Unknown error' });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Verify password using the model method
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create token
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          _id: user._id,
          email: user.email
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in', error: error.message || 'Unknown error' });
    }
  },

  verifyToken: async (req: Request, res: Response) => {
    try {
      // User is already authenticated through middleware
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error: any) {
      console.error('Token verification error:', error);
      res.status(500).json({ message: 'Error verifying token', error: error.message || 'Unknown error' });
    }
  }
};

export default authController;
