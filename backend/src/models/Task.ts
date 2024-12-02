import mongoose from 'mongoose';

export interface ITask extends mongoose.Document {
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
  userId: mongoose.Types.ObjectId;
  category: string;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  subtasks: {
    title: string;
    completed: boolean;
  }[];
}

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  dueDate: {
    type: Date,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    default: 'general',
    trim: true,
  },
  estimatedTime: {
    type: Number,
    min: 0,
  },
  actualTime: {
    type: Number,
    min: 0,
  },
  subtasks: [{
    title: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  }],
}, {
  timestamps: true,
});

// Create indexes for better query performance
taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, category: 1 });

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
