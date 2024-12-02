import { Request, Response } from 'express';
import Task from '../models/Task';
import { analyzeTaskPatterns, generateRecommendations } from '../services/aiService';

export const taskController = {
  // Get all tasks for a user
  getAllTasks: async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
      res.json(tasks);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Error fetching tasks', error: error.message || 'Unknown error' });
    }
  },

  // Create a new task
  createTask: async (req: Request, res: Response) => {
    try {
      const task = new Task({
        ...req.body,
        userId: req.user._id
      });
      await task.save();
      res.status(201).json(task);
    } catch (error: any) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Error creating task', error: error.message || 'Unknown error' });
    }
  },

  // Update a task
  updateTask: async (req: Request, res: Response) => {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true }
      );
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (error: any) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Error updating task', error: error.message || 'Unknown error' });
    }
  },

  // Delete a task
  deleteTask: async (req: Request, res: Response) => {
    try {
      const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Error deleting task', error: error.message || 'Unknown error' });
    }
  },

  // Get AI suggestions for task optimization
  getAISuggestions: async (req: Request, res: Response) => {
    try {
      // Get user's tasks
      const tasks = await Task.find({ userId: req.user._id });
      
      if (!tasks.length) {
        // Return empty data structure with default values
        return res.json({
          priorityRecommendations: {
            overdueTasksCount: 0,
            urgentTasks: [],
            recommendation: "Start by creating your first task! Once you have some tasks, I can provide personalized suggestions."
          },
          timeManagementTips: {
            averageTaskCompletionTime: 0,
            tips: ["Create your first task to get started with time management tips."]
          },
          productivityInsights: {
            completionRate: 0,
            taskDistribution: {
              high: 0,
              medium: 0,
              low: 0
            },
            insights: ["Add tasks to receive productivity insights."]
          }
        });
      }

      // Calculate overdue tasks
      const now = new Date();
      const overdueTasks = tasks.filter(task => 
        task.dueDate && new Date(task.dueDate) < now && !task.completed
      );

      // Calculate urgent tasks (due within next 24 hours)
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const urgentTasks = tasks.filter(task => 
        task.dueDate && 
        new Date(task.dueDate) > now && 
        new Date(task.dueDate) <= tomorrow && 
        !task.completed
      ).map(task => ({
        id: task._id,
        title: task.title,
        dueDate: task.dueDate
      }));

      // Calculate task distribution
      const allTasks = tasks.length;
      const highPriority = tasks.filter(task => task.priority === 'high').length;
      const mediumPriority = tasks.filter(task => task.priority === 'medium').length;
      const lowPriority = tasks.filter(task => task.priority === 'low').length;

      // Calculate completion rate
      const completedTasks = tasks.filter(task => task.completed).length;
      const completionRate = allTasks > 0 ? (completedTasks / allTasks) * 100 : 0;

      // Generate response
      const response = {
        priorityRecommendations: {
          overdueTasksCount: overdueTasks.length,
          urgentTasks,
          recommendation: overdueTasks.length > 0 
            ? `You have ${overdueTasks.length} overdue tasks. Consider prioritizing these tasks.`
            : "You're doing great at keeping up with your tasks!"
        },
        timeManagementTips: {
          averageTaskCompletionTime: 30, // Default value, replace with actual calculation if available
          tips: [
            "Break down large tasks into smaller, manageable chunks",
            "Use the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break",
            "Plan your most important tasks for your peak productivity hours"
          ]
        },
        productivityInsights: {
          completionRate: Math.round(completionRate),
          taskDistribution: {
            high: highPriority,
            medium: mediumPriority,
            low: lowPriority
          },
          insights: [
            `Your task completion rate is ${Math.round(completionRate)}%`,
            `${highPriority} high priority tasks need attention`,
            "Keep maintaining a balanced task distribution"
          ]
        }
      };
      
      res.json(response);
    } catch (error: any) {
      console.error('Error generating AI suggestions:', error);
      res.status(500).json({
        message: 'Error generating AI suggestions',
        error: error.message || 'Unknown error'
      });
    }
  }
};

export default taskController;
