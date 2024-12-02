import express from 'express';
import taskController from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Task management routes
router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// AI suggestions route
router.get('/ai-suggestions', taskController.getAISuggestions);

export default router;
