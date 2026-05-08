const express = require('express');
const {
  createBooking,
  updateBookingStatus,
  getBookingsByEmail,
  getAllBookings
} = require('../controllers/bookingController');

const router = express.Router();

router.post('/', createBooking);
router.get('/admin', getAllBookings);
router.patch('/:id/status', updateBookingStatus);
router.get('/', getBookingsByEmail);

module.exports = router;
