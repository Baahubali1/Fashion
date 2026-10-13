import express from 'express';

import {
  createOrder,
  getMyOrders,
  getMyOrderById
} from '../controllers/orderController.js';

import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Create a new order
router.post('/', authenticate, createOrder);

// Get all orders belonging to the logged-in user
router.get('/my-orders', authenticate, getMyOrders);

// Get a specific order belonging to the logged-in user
router.get('/my-orders/:id', authenticate, getMyOrderById);

export default router;