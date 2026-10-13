import express from 'express';

import {
  getProducts,
  getProductById
} from '../controllers/productController.js';

const router = express.Router();

// Get all products, optionally filtered by category
router.get('/', getProducts);

// Get a specific product by its ID
router.get('/:id', getProductById);

export default router;