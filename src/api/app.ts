import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFoundHandler, rateLimitHandler } from '../middleware/errorHandler';
import { businessRoutes } from './routes/businessRoutes';
import { financialRoutes } from './routes/financialRoutes';
import { analyticsRoutes } from './routes/analyticsRoutes';
import { adviceRoutes } from './routes/adviceRoutes';
import { authRoutes } from './routes/authRoutes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:8080', // Allow only Vite dev server
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  handler: rateLimitHandler
});
app.use(limiter);

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/financials', financialRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/advice', adviceRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
 