const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const expertRoutes = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*'
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
