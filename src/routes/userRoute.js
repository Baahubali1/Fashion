import express from 'express';

import {
    createUser,
    login,
    getCurrentUser,
    logout
} from '../controllers/userController.js';

import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Public routes
router.post('/register', createUser);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

export default router;