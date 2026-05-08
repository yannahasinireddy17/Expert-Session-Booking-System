const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data.json');

let db = {
  experts: [],
  bookings: []
};

const loadDb = () => {
  try {
    if (fs.existsSync(dbPath)) {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    }
  } catch {
    db = { experts: [], bookings: [] };
  }
};

const saveDb = () => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

const initializeExperts = () => {
  if (db.experts.length === 0) {
    db.experts = [
      {
        _id: '1',
        name: 'Aarav Sharma',
        category: 'Career Coaching',
        experience: 8,
        rating: 4.8,
        bio: 'Helps professionals switch careers with clear transition strategies.',
        slots: [
          { date: '2026-05-09', timeSlots: ['10:00', '11:00', '15:00'] },
          { date: '2026-05-10', timeSlots: ['09:00', '13:00', '16:00'] }
        ]
      },
      {
        _id: '2',
        name: 'Maya Iyer',
        category: 'Fitness',
        experience: 6,
        rating: 4.6,
        bio: 'Specialized in personalized fitness and rehabilitation planning.',
        slots: [
          { date: '2026-05-09', timeSlots: ['08:00', '12:00', '18:00'] },
          { date: '2026-05-10', timeSlots: ['10:30', '14:30', '17:30'] }
        ]
      },
      {
        _id: '3',
        name: 'Rahul Menon',
        category: 'Finance',
        experience: 10,
        rating: 4.9,
        bio: 'Expert in personal finance, investing, and debt optimization.',
        slots: [
          { date: '2026-05-09', timeSlots: ['09:30', '11:30', '16:30'] },
          { date: '2026-05-10', timeSlots: ['10:00', '12:30', '15:30'] }
        ]
      },
      {
        _id: '4',
        name: 'Neha Verma',
        category: 'Mental Wellness',
        experience: 7,
        rating: 4.7,
        bio: 'Supports stress management and work-life balance practices.',
        slots: [
          { date: '2026-05-09', timeSlots: ['07:30', '13:30', '19:00'] },
          { date: '2026-05-10', timeSlots: ['09:00', '11:00', '14:00'] }
        ]
      },
      {
        _id: '5',
        name: 'Kabir Sethi',
        category: 'Technology',
        experience: 9,
        rating: 4.8,
        bio: 'Guides developers in architecture, scaling, and interview prep.',
        slots: [
          { date: '2026-05-09', timeSlots: ['10:00', '12:00', '17:00'] },
          { date: '2026-05-10', timeSlots: ['08:30', '13:00', '18:00'] }
        ]
      },
      {
        _id: '6',
        name: 'Ananya Rao',
        category: 'Nutrition',
        experience: 5,
        rating: 4.5,
        bio: 'Creates practical meal and lifestyle plans for long-term health.',
        slots: [
          { date: '2026-05-09', timeSlots: ['09:00', '12:00', '16:00'] },
          { date: '2026-05-10', timeSlots: ['10:00', '14:00', '17:00'] }
        ]
      },
      {
        _id: '7',
        name: 'Sana Kapoor',
        category: 'Career Coaching',
        experience: 11,
        rating: 4.9,
        bio: 'Helps leaders navigate promotions, interviews, and career pivots.',
        slots: [
          { date: '2026-05-09', timeSlots: ['10:30', '14:00', '18:00'] },
          { date: '2026-05-10', timeSlots: ['09:30', '13:30', '16:30'] }
        ]
      },
      {
        _id: '8',
        name: 'Rohan Desai',
        category: 'Technology',
        experience: 12,
        rating: 4.9,
        bio: 'Advises teams on scalable architecture, backend systems, and interviews.',
        slots: [
          { date: '2026-05-09', timeSlots: ['08:30', '12:30', '17:30'] },
          { date: '2026-05-10', timeSlots: ['10:30', '15:00', '18:30'] }
        ]
      },
      {
        _id: '9',
        name: 'Priya Nair',
        category: 'Mental Wellness',
        experience: 9,
        rating: 4.8,
        bio: 'Supports mindfulness routines, burnout recovery, and confidence building.',
        slots: [
          { date: '2026-05-09', timeSlots: ['08:00', '11:30', '15:30'] },
          { date: '2026-05-10', timeSlots: ['09:30', '12:00', '16:00'] }
        ]
      },
      {
        _id: '10',
        name: 'Arjun Mehta',
        category: 'Fitness',
        experience: 7,
        rating: 4.7,
        bio: 'Designs strength and mobility plans for busy professionals.',
        slots: [
          { date: '2026-05-09', timeSlots: ['07:00', '10:00', '13:00'] },
          { date: '2026-05-10', timeSlots: ['08:00', '11:00', '14:00'] }
        ]
      },
      {
        _id: '11',
        name: 'Meera Joshi',
        category: 'Finance',
        experience: 8,
        rating: 4.8,
        bio: 'Guides budgeting, investing, and long-term wealth planning.',
        slots: [
          { date: '2026-05-09', timeSlots: ['09:15', '12:15', '15:15'] },
          { date: '2026-05-10', timeSlots: ['10:15', '13:15', '16:15'] }
        ]
      },
      {
        _id: '12',
        name: 'Nikhil Bansal',
        category: 'Nutrition',
        experience: 6,
        rating: 4.6,
        bio: 'Helps build sustainable meal strategies for energy and health.',
        slots: [
          { date: '2026-05-09', timeSlots: ['08:45', '11:45', '14:45'] },
          { date: '2026-05-10', timeSlots: ['09:45', '12:45', '15:45'] }
        ]
      }
    ];
    saveDb();
  }
};

loadDb();
initializeExperts();

module.exports = {
  db,
  saveDb,
  loadDb
};
