import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import ExpertListPage from './pages/ExpertListPage';
import ExpertDetailPage from './pages/ExpertDetailPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';

const App = () => {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Expert Session Booking</h1>
          <p className="topbar-subtitle">Live expert discovery, booking, and status tracking.</p>
        </div>
        <nav>
          <NavLink to="/experts" end>
            Experts
          </NavLink>
          <NavLink to="/my-bookings">My Bookings</NavLink>
          <NavLink to="/admin/bookings">Admin</NavLink>
        </nav>
      </header>

      <main className="page-container">
        <Routes>
          <Route path="/" element={<Navigate to="/experts" replace />} />
          <Route path="/experts" element={<ExpertListPage />} />
          <Route path="/experts/:id" element={<ExpertDetailPage />} />
          <Route path="/book/:expertId" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
