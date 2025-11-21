const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/diamondz-playhouse', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Stripe webhooks need raw body, so parse them before JSON middleware
// Support for 3 webhook endpoints (dev, test, production)
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
app.use('/api/webhooks/stripe-dev', express.raw({ type: 'application/json' }));
app.use('/api/webhooks/stripe-test', express.raw({ type: 'application/json' }));
app.use('/api/webhooks/stripe-prod', express.raw({ type: 'application/json' }));

// Parse JSON bodies for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/comics', require('./routes/comics'));
app.use('/api/arcade', require('./routes/arcade'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/webhooks', require('./routes/webhooks'));
app.use('/api/users', require('./routes/users'));
app.use('/api/rewards', require('./routes/rewards'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Diamondz Playhouse API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Diamondz Playhouse API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
