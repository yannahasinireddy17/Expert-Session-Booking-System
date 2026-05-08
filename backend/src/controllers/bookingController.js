const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const { db, saveDb } = require('../config/mockDb');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createBooking = async (req, res, next) => {
  try {
    const { expertId, name, email, phone, date, timeSlot, notes } = req.body;

    if (!expertId || !name || !email || !phone || !date || !timeSlot) {
      res.status(400);
      throw new Error('expertId, name, email, phone, date, and timeSlot are required');
    }

    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error('Please provide a valid email address');
    }

    if (global.demoMode) {
      const expert = db.experts.find(e => e._id === expertId);

      if (!expert) {
        res.status(404);
        throw new Error('Expert not found');
      }

      const slotGroup = expert.slots.find(slot => slot.date === date);
      if (!slotGroup || !slotGroup.timeSlots.includes(timeSlot)) {
        res.status(400);
        throw new Error('Selected slot is not valid for this expert');
      }

      const existing = db.bookings.find(
        b => b.expert === expertId && b.date === date && b.timeSlot === timeSlot
      );

      if (existing) {
        res.status(409);
        throw new Error('This slot is already booked by another user');
      }

      const booking = {
        _id: Date.now().toString(),
        expert: expertId,
        name,
        email,
        phone,
        date,
        timeSlot,
        notes: notes || '',
        status: 'Pending'
      };

      db.bookings.push(booking);
      saveDb();

      const io = req.app.get('io');
      if (io) {
        io.to(`expert:${expertId}`).emit('slotBooked', {
          expertId,
          date,
          timeSlot
        });
      }

      return res.status(201).json({
        message: 'Booking created successfully',
        data: booking
      });
    }

    const session = await mongoose.startSession();

    try {
      const expert = await Expert.findById(expertId);

      if (!expert) {
        res.status(404);
        throw new Error('Expert not found');
      }

      const slotGroup = expert.slots.find((slot) => slot.date === date);
      if (!slotGroup || !slotGroup.timeSlots.includes(timeSlot)) {
        res.status(400);
        throw new Error('Selected slot is not valid for this expert');
      }

      session.startTransaction();

      const [booking] = await Booking.create(
        [
          {
            expert: expertId,
            name,
            email,
            phone,
            date,
            timeSlot,
            notes: notes || ''
          }
        ],
        { session }
      );

      await session.commitTransaction();

      const io = req.app.get('io');
      if (io) {
        io.to(`expert:${expertId}`).emit('slotBooked', {
          expertId,
          date,
          timeSlot
        });
      }

      res.status(201).json({
        message: 'Booking created successfully',
        data: booking
      });
    } catch (error) {
      await session.abortTransaction();

      if (error && error.code === 11000) {
        res.status(409);
        return next(new Error('This slot is already booked by another user'));
      }

      return next(error);
    } finally {
      session.endSession();
    }
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Confirmed', 'Completed'];

    if (!status || !allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error('status must be one of Pending, Confirmed, Completed');
    }

    if (global.demoMode) {
      const booking = db.bookings.find(b => b._id === req.params.id);

      if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
      }

      booking.status = status;
      saveDb();

      return res.json({
        message: 'Booking status updated successfully',
        data: booking
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    res.json({
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

const getBookingsByEmail = async (req, res, next) => {
  try {
    const email = req.query.email;

    if (!email) {
      res.status(400);
      throw new Error('email query parameter is required');
    }

    if (global.demoMode) {
      const bookings = db.bookings
        .filter(b => b.email.toLowerCase() === email.toLowerCase())
        .map(b => ({
          ...b,
          expert: db.experts.find(e => e._id === b.expert)
        }))
        .sort((a, b) => b._id - a._id);

      return res.json({ data: bookings });
    }

    const bookings = await Booking.find({ email: email.toLowerCase() })
      .populate('expert', 'name category')
      .sort({ createdAt: -1 });

    res.json({ data: bookings });
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const { email, status } = req.query;

    if (global.demoMode) {
      const bookings = db.bookings
        .filter((booking) => {
          const matchesEmail = email ? booking.email.toLowerCase().includes(email.toLowerCase()) : true;
          const matchesStatus = status ? booking.status === status : true;

          return matchesEmail && matchesStatus;
        })
        .map((booking) => ({
          ...booking,
          expert: db.experts.find((expert) => expert._id === booking.expert)
        }))
        .sort((a, b) => b._id - a._id);

      return res.json({ data: bookings });
    }

    const query = {};

    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('expert', 'name category')
      .sort({ createdAt: -1 });

    res.json({ data: bookings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  updateBookingStatus,
  getBookingsByEmail,
  getAllBookings
};
