import { useEffect, useState } from 'react';
import { api } from '../api/client';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getStoredUser, isValidEmail } from '../utils/auth';

const MyBookingsPage = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getStoredUser();

    if (user?.email) {
      setEmail(user.email);
    }
  }, []);

  const fetchBookings = async (event) => {
    event.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Enter a valid email to fetch your bookings');
      return;
    }

    setLoading(true);

    try {
      const response = await api.get(`/bookings?email=${encodeURIComponent(email)}`);
      setBookings(response.data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>My Bookings</h2>
      <p>Track your booking status by entering your email address.</p>

      <form className="booking-query" onSubmit={fetchBookings}>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit">Get Bookings</button>
      </form>

      {loading && <LoadingState text="Loading your bookings..." />}
      {!loading && error && <ErrorState message={error} />}

      {!loading && !error && bookings.length > 0 && (
        <div className="booking-list">
          {bookings.map((booking) => (
            <article key={booking._id} className="booking-item">
              <h3>{booking.expert?.name || 'Unknown Expert'}</h3>
              <p>{booking.expert?.category || 'Unknown Category'}</p>
              <p>
                {booking.date} at {booking.timeSlot}
              </p>
              <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="state">No bookings found yet for this email.</div>
      )}
    </section>
  );
};

export default MyBookingsPage;
