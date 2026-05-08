const Expert = require('../models/Expert');
const Booking = require('../models/Booking');
const { db, saveDb } = require('../config/mockDb');

const getExperts = async (req, res, next) => {
  try {
    if (global.demoMode) {
      const page = Math.max(parseInt(req.query.page || '1', 10), 1);
      const limit = Math.min(Math.max(parseInt(req.query.limit || '6', 10), 1), 50);

      let filtered = db.experts;

      if (req.query.search) {
        filtered = filtered.filter(e =>
          e.name.toLowerCase().includes(req.query.search.toLowerCase())
        );
      }

      if (req.query.category && req.query.category !== 'All') {
        filtered = filtered.filter(e => e.category === req.query.category);
      }

      const start = (page - 1) * limit;
      const paged = filtered.slice(start, start + limit);

      return res.json({
        data: paged,
        pagination: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit)
        }
      });
    }

    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '6', 10), 1), 50);

    const filter = {};

    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const [experts, total] = await Promise.all([
      Expert.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Expert.countDocuments(filter)
    ]);

    res.json({
      data: experts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getExpertById = async (req, res, next) => {
  try {
    if (global.demoMode) {
      const expert = db.experts.find(e => e._id === req.params.id);

      if (!expert) {
        res.status(404);
        throw new Error('Expert not found');
      }

      const bookedByDate = db.bookings
        .filter(b => b.expert === req.params.id)
        .reduce((acc, booking) => {
          if (!acc[booking.date]) {
            acc[booking.date] = new Set();
          }
          acc[booking.date].add(booking.timeSlot);
          return acc;
        }, {});

      const slotAvailability = expert.slots.map((slotGroup) => {
        const bookedSet = bookedByDate[slotGroup.date] || new Set();

        return {
          date: slotGroup.date,
          slots: slotGroup.timeSlots.map((slot) => ({
            time: slot,
            isBooked: bookedSet.has(slot)
          }))
        };
      });

      return res.json({
        data: {
          ...expert,
          slotAvailability
        }
      });
    }

    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      res.status(404);
      throw new Error('Expert not found');
    }

    const bookings = await Booking.find({ expert: expert._id }).select('date timeSlot -_id');

    const bookedByDate = bookings.reduce((acc, booking) => {
      if (!acc[booking.date]) {
        acc[booking.date] = new Set();
      }
      acc[booking.date].add(booking.timeSlot);
      return acc;
    }, {});

    const slotAvailability = expert.slots.map((slotGroup) => {
      const bookedSet = bookedByDate[slotGroup.date] || new Set();

      return {
        date: slotGroup.date,
        slots: slotGroup.timeSlots.map((slot) => ({
          time: slot,
          isBooked: bookedSet.has(slot)
        }))
      };
    });

    res.json({
      data: {
        ...expert.toObject(),
        slotAvailability
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExperts,
  getExpertById
};
