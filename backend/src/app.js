const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const expertRoutes = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

const normalizeOrigin = (value) => {
  if (!value) {
    return '';
  }

  try {
    return new URL(value).origin;
  } catch {
    return value.trim().replace(/\/+$/, '');
  }
};

const configuredOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((item) => normalizeOrigin(item))
  .filter(Boolean);

const defaultOrigins = ['http://localhost:5173', 'https://expert-booking-frontend.vercel.app'];
const allowedOrigins = new Set([...configuredOrigins, ...defaultOrigins]);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has('*')) {
        return callback(null, true);
      }

      const normalized = normalizeOrigin(origin);

      if (allowedOrigins.has(normalized)) {
        return callback(null, true);
      }

      return callback(new Error('CORS origin not allowed'));
    }
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

app.use('/experts', expertRoutes);
app.use('/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
