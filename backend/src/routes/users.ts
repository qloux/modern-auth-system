import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// GET /api/users
router.get('/', async (req: Request, res: Response) => {
    try {
        res.json({ message: 'Users route working' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
