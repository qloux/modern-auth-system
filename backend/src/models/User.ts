import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface UserModel extends mongoose.Model<IUser> {
  createTestUser(): Promise<void>;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Create test user if it doesn't exist
userSchema.statics.createTestUser = async function(): Promise<void> {
  try {
    const testUser = await this.findOne({ email: 'test@example.com' });
    if (!testUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      await this.create({
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        preferences: {
          theme: 'light',
          notifications: true,
        },
      });
      console.log('Test user created successfully');
    }
  } catch (error) {
    console.error('Error creating test user:', error);
  }
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);

// Create test user on model initialization
User.createTestUser();

export default User;
