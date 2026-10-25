const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5001; // Port 5001 avoids macOS AirPlay ControlCenter clash

// CORS configuration (ICTAK Section 7.4)
// Allows same-origin, Render deployments, local Vite (5173), and mobile/curl tools
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
  });
}

// API Health & Diagnostic check endpoint
app.get('/api/health', (req, res) => {
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const database = dbStateMap[mongoose.connection.readyState] || 'unknown';

  res.status(200).json({
    status: 'healthy',
    message: 'Sahrdaya Campus EventHub API is operating normally',
    project: 'Sahrdaya Campus Event & Ticket/Pass Booking Portal',
    institution: 'Sahrdaya College of Engineering & Technology, Kodakara',
    developer: 'Alen (alen225001@sahrdaya.ac.in)',
    database,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Resource Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);

// Serve static React client in production (ICTAK Section 9: Deployment & Hosting)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (process.env.NODE_ENV === 'production' || fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'online',
      project: 'Sahrdaya Campus EventHub API',
      developer: 'Alen (alen225001@sahrdaya.ac.in)',
      endpoints: {
        events: '/api/events',
        auth: '/api/auth',
        registrations: '/api/registrations',
        admin: '/api/admin',
        health: '/api/health',
      },
    });
  });
}

// 404 Route Not Found
app.use(notFound);

// Central Error Handler (ICTAK Section 6.3)
app.use(errorHandler);

// Only listen if executed directly (not when required by tests)
if (require.main === module && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Sahrdaya Campus EventHub API Running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🎓 Developer: Alen (alen225001@sahrdaya.ac.in)`);
    console.log(`====================================================`);
  });
}

module.exports = app;
