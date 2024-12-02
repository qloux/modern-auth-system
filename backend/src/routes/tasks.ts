import express, { Request, Response } from 'express';
import Task from '../models/Task';

const router = express.Router();

// Get all tasks
router.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.user?._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create new task
router.post('/', async (req: Request, res: Response) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user?._id,
      aiSuggestions: {
        predictedPriority: req.body.priority, // Temporary, will be AI-powered later
        predictedCategory: req.body.category,
        completionProbability: 0.8
      }
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task' });
  }
});

// Update task
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task' });
  }
});

// Delete task
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting task' });
  }
});

export default router;
