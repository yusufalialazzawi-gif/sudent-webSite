import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Import middlewares
import { errorHandler } from './src/middleware/errorHandler.js';
import { apiLimiter } from './src/middleware/rateLimiter.js';
import { normalizePagination } from './src/middleware/pagination.js';

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
import reviewRoutes from './src/routes/reviewRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
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

// gzip JSON/text responses (images/video are already compressed and are skipped by default filter)
app.use(compression({ threshold: 1024 }));

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static public uploads
const uploadsDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use(
  '/uploads',
  express.static(uploadsDir, {
    maxAge: '7d', // ETag/Last-Modified revalidation still applies after expiry
    setHeaders: (res) => res.setHeader('Cache-Control', 'public, max-age=604800'),
  })
);

// Apply global API rate limiter
app.use('/api', apiLimiter);
app.use('/api', normalizePagination);

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
app.use('/api/reviews', reviewRoutes);

// Serve Frontend production build (Single Domain: serves both main site & admin portal)
const frontendDistPath = path.resolve(process.env.FRONTEND_DIST_DIR || path.join(__dirname, '../frontend/dist'));
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start server if executed directly
const currentFilePath = __filename;
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
