//TODO: Use the db.js connectToMongoDB() function
//TODO: In future we could add email verification by sending a temporary otp to their mail while signing up to verify that it is a valid email

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import {
  connectToMongoDB,
  disconnectFromMongoDB
} from './connection.js';

import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim().replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without an Origin header (e.g. Postman/server-to-server).
    // Browser requests from other origins are checked against the allowlist.
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Basic health-check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Register API routes
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

// Start server only after MongoDB connects
let server;
let isShuttingDown = false;

async function startServer() {
  try {
    await connectToMongoDB();

    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', err => {
      console.error('HTTP server error:', err);
      process.exitCode = 1;
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exitCode = 1;
  }
}

// Graceful shutdown
async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`${signal} received. Shutting down...`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close(err => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    await disconnectFromMongoDB();
    console.log('Shutdown completed.');
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exitCode = 1;
  }
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));

startServer();