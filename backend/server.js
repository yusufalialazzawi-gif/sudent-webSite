import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Import middlewares
import { errorHandler } from './src/middleware/errorHandler.js';
import { apiLimiter } from './src/middleware/rateLimiter.js';

// Import route modules
import authRoutes from './src/routes/authRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import universityRoutes from './src/routes/universityRoutes.js';
import programRoutes from './src/routes/programRoutes.js';
import serviceRoutes from './src/routes/serviceRoutes.js';
import courseRoutes from './src/routes/courseRoutes.js';
import scholarshipRoutes from './src/routes/scholarshipRoutes.js';
import articleRoutes from './src/routes/articleRoutes.js';
import applicationRoutes from './src/routes/applicationRoutes.js';
import pageBuilderRoutes from './src/routes/pageBuilderRoutes.js';
import mediaRoutes from './src/routes/mediaRoutes.js';
import translationRoutes from './src/routes/translationRoutes.js';
import settingsRoutes from './src/routes/settingsRoutes.js';
import staffRoutes from './src/routes/staffRoutes.js';
import publicRoutes from './src/routes/publicRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: corsOrigin === '*' ? true : [corsOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static public uploads
const uploadsDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Apply global API rate limiter
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'turkey-education-platform-api',
    version: '1.0.0',
  });
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/page-builder', pageBuilderRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/translations', translationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/public', publicRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start server if executed directly
import { fileURLToPath } from 'url';
const currentFilePath = fileURLToPath(import.meta.url);
const executedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (currentFilePath === executedFilePath) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Turkey Education Platform Backend Server Running`);
    console.log(` Port: ${PORT}`);
    console.log(` Health: http://localhost:${PORT}/api/health`);
    console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=======================================================`);
  });
}

export default app;
