const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const config = require('./config/env');
const connectDB = require('./config/db');
const { initSocket } = require('./sockets/socketManager');
const errorHandler = require('./middleware/error.middleware');
const { apiLimiter } = require('./middleware/rateLimiter.middleware');

// Listeners
const registerNotificationListeners = require('./listeners/notification.listener');
const registerActivityLogListeners = require('./listeners/activityLog.listener');
const registerQueueProducerListeners = require('./listeners/queueProducer.listener');

// Workers
const startEmailWorker = require('./workers/emailWorker');
const startReminderWorker = require('./workers/reminderWorker');

// Routes
const authRoutes = require('./routes/auth.routes');
const carRoutes = require('./routes/car.routes');
const categoryRoutes = require('./routes/category.routes');
const testDriveRoutes = require('./routes/testDrive.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const chatRoutes = require('./routes/chat.routes');
const notificationRoutes = require('./routes/notification.routes');
const statsRoutes = require('./routes/stats.routes');
const userRoutes = require('./routes/user.routes');
const reservationRoutes = require('./routes/reservation.routes');

const app = express();
const server = http.createServer(app);

// Initialize Database Connection
connectDB();

// Register Event Listeners
registerNotificationListeners();
registerActivityLogListeners();
registerQueueProducerListeners();

// Start Background Workers
startEmailWorker();
startReminderWorker();

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// ── JSON Body Parsing ────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Apply General Rate Limiter to API
app.use('/api', apiLimiter);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/test-drives', testDriveRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'AutoLuxe Real-Time Car Dealership API',
    timestamp: new Date()
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Initialize Socket.IO Server
initSocket(server);

// Start HTTP Server
const PORT = config.port;
server.listen(PORT, () => {
  console.log(`\n🚀 [AutoLuxe Backend] Running on http://localhost:${PORT}`);
  console.log(`⚡ Real-Time Socket.IO listening on port ${PORT}`);
  console.log(`💳 Stripe Webhook endpoint: POST http://localhost:${PORT}/api/reservations/webhook`);
  console.log(`📁 Static files served at http://localhost:${PORT}/uploads/\n`);
});

module.exports = { app, server };
