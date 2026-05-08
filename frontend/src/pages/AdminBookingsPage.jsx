import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const statuses = ['All', 'Pending', 'Confirmed', 'Completed'];

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [emailFilter, setEmailFilter] = useState('');
  const [draftStatuses, setDraftStatuses] = useState({});
  const [savingId, setSavingId] = useState('');

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (statusFilter !== 'All') {
      params.set('status', statusFilter);
    }

    if (emailFilter.trim()) {
      params.set('email', emailFilter.trim());
    }

    return params.toString();
  }, [statusFilter, emailFilter]);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get(`/bookings/admin${queryString ? `?${queryString}` : ''}`);
        setBookings(response.data.data);
        setDraftStatuses(
          response.data.data.reduce((accumulator, booking) => {
            accumulator[booking._id] = booking.status;
            return accumulator;
          }, {})
        );
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [queryString]);

  const updateStatus = async (bookingId) => {
    setSavingId(bookingId);
    setError('');

    try {
      const response = await api.patch(`/bookings/${bookingId}/status`, {
        status: draftStatuses[bookingId]
      });

      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId ? { ...booking, status: response.data.data.status } : booking
        )
      );
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to update booking status');
    } finally {
      setSavingId('');
    }
  };

  return (
    <section>
      <div className="hero">
        <h2>Admin Booking Management</h2>
        <p>Review bookings and move them through Pending, Confirmed, and Completed.</p>
      </div>

      <div className="filters admin-filters">
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filter by customer email"
          value={emailFilter}
          onChange={(event) => setEmailFilter(event.target.value)}
        />

        <button
          type="button"
          className="ghost-button"
          onClick={() => {
            setStatusFilter('All');
            setEmailFilter('');
          }}
        >
          Reset
        </button>
      </div>

      {loading && <LoadingState text="Loading bookings..." />}
      {!loading && error && <ErrorState message={error} />}

      {!loading && !error && bookings.length === 0 && (
        <div className="state">No bookings match the current filters.</div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="admin-bookings">
          {bookings.map((booking) => (
            <article key={booking._id} className="booking-item admin-booking-card">
              <div className="booking-card-head">
                <div>
                  <h3>{booking.expert?.name || 'Unknown Expert'}</h3>
                  <p className="muted-copy">
                    {booking.expert?.category || 'Unknown Category'} · {booking.date} · {booking.timeSlot}
                  </p>
                </div>
                <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span>
              </div>

              <div className="booking-grid">
                <p><strong>Name:</strong> {booking.name}</p>
                <p><strong>Email:</strong> {booking.email}</p>
                <p><strong>Phone:</strong> {booking.phone}</p>
                <p><strong>Notes:</strong> {booking.notes || 'None'}</p>
              </div>

              <div className="admin-actions">
                <select
                  value={draftStatuses[booking._id] || booking.status}
                  onChange={(event) =>
                    setDraftStatuses((current) => ({
                      ...current,
                      [booking._id]: event.target.value
                    }))
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  type="button"
                  disabled={savingId === booking._id || draftStatuses[booking._id] === booking.status}
                  onClick={() => updateStatus(booking._id)}
                >
                  {savingId === booking._id ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminBookingsPage;