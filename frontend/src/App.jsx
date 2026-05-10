import { useEffect, useState } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import ExpertListPage from './pages/ExpertListPage';
import ExpertDetailPage from './pages/ExpertDetailPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import LoginPage from './pages/LoginPage';
import { clearStoredUser, getStoredUser } from './utils/auth';

const RequireUser = ({ children }) => {
  const location = useLocation();
  const user = getStoredUser();

  if (!user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return children;
};

const App = () => {
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const refreshUser = () => {
      setUser(getStoredUser());
    };

    window.addEventListener('auth-changed', refreshUser);

    return () => {
      window.removeEventListener('auth-changed', refreshUser);
    };
  }, []);

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
          {user && <NavLink to="/my-bookings">My Bookings</NavLink>}
          {!user && <NavLink to="/login">Login</NavLink>}
          {user && (
            <button type="button" className="logout-link" onClick={clearStoredUser}>
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="page-container">
        <Routes>
          <Route path="/" element={<Navigate to="/experts" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/experts" element={<ExpertListPage />} />
          <Route path="/experts/:id" element={<ExpertDetailPage />} />
          <Route
            path="/book/:expertId"
            element={
              <RequireUser>
                <BookingPage />
              </RequireUser>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <RequireUser>
                <MyBookingsPage />
              </RequireUser>
            }
          />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
