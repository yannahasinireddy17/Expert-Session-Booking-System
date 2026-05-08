import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const REFRESH_INTERVAL_MS = 5000;

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  date: '',
  timeSlot: '',
  notes: ''
};

const BookingPage = () => {
  const { expertId } = useParams();
  const [searchParams] = useSearchParams();

  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const presetDate = searchParams.get('date') || '';
    const presetTime = searchParams.get('time') || '';

    setForm((prev) => ({
      ...prev,
      date: presetDate,
      timeSlot: presetTime
    }));
  }, [searchParams]);

  useEffect(() => {
    let intervalId;
    let cancelled = false;

    const fetchExpert = async (showLoading = false) => {
      if (showLoading) {
        setLoading(true);
      }

      setError('');

      try {
        const response = await api.get(`/experts/${expertId}`);

        if (!cancelled) {
          setExpert(response.data.data);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.response?.data?.message || 'Failed to fetch expert details');
        }
      } finally {
        if (!cancelled && showLoading) {
          setLoading(false);
        }
      }
    };

    fetchExpert(true);
    intervalId = window.setInterval(() => {
      fetchExpert(false);
    }, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [expertId]);

  const availableTimes = useMemo(() => {
    const dateGroup = expert?.slotAvailability?.find((group) => group.date === form.date);
    return dateGroup ? dateGroup.slots : [];
  }, [expert, form.date]);

  const validate = () => {
    if (!form.name.trim()) {
      return 'Name is required';
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return 'Valid email is required';
    }
    if (!form.phone.trim()) {
      return 'Phone number is required';
    }
    if (!form.date) {
      return 'Date is required';
    }
    if (!form.timeSlot) {
      return 'Time slot is required';
    }
    return '';
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/bookings', {
        expertId,
        ...form
      });

      setSuccess('Booking successful. You will receive status updates soon.');
      setForm((prev) => ({ ...emptyForm, email: prev.email }));

      const response = await api.get(`/experts/${expertId}`);
      setExpert(response.data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState text="Preparing booking form..." />;
  }

  if (error && !expert) {
    return <ErrorState message={error} />;
  }

  return (
    <section className="form-wrap">
      <div className="detail-head booking-head">
        <div>
          <h2>Book Session with {expert?.name}</h2>
          <p>Fill in your details to reserve an available slot.</p>
        </div>

        <div className="pill-group">
          <span className="chip">{expert?.category}</span>
          <span className="chip">{expert?.experience} years</span>
          <span className="chip">{expert?.rating}/5</span>
        </div>
      </div>

      <div className="booking-summary">
        <div>
          <strong>Selected slot</strong>
          <p>
            {form.date ? `${form.date}` : 'Choose a date'}
            {form.timeSlot ? ` · ${form.timeSlot}` : ''}
          </p>
        </div>
        <Link to={`/experts/${expertId}`} className="ghost-button">
          Back to expert details
        </Link>
      </div>

      {error && <ErrorState message={error} />}
      {success && <div className="state success">{success}</div>}

      <form onSubmit={onSubmit} className="booking-form">
        <label>
          Name
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
        </label>

        <label>
          Phone
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          />
        </label>

        <label>
          Date
          <select
            value={form.date}
            onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value, timeSlot: '' }))}
          >
            <option value="">Select date</option>
            {expert?.slotAvailability?.map((group) => (
              <option key={group.date} value={group.date}>
                {group.date}
              </option>
            ))}
          </select>
        </label>

        <label>
          Time Slot
          <select
            value={form.timeSlot}
            onChange={(event) => setForm((prev) => ({ ...prev, timeSlot: event.target.value }))}
            disabled={!form.date}
          >
            <option value="">Select time slot</option>
            {availableTimes.map((slot) => (
              <option key={slot.time} value={slot.time} disabled={slot.isBooked}>
                {slot.time} {slot.isBooked ? '(Booked)' : ''}
              </option>
            ))}
          </select>
        </label>

        <label>
          Notes
          <textarea
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            rows={4}
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>

      {form.date && availableTimes.length === 0 && (
        <div className="state">No slots are available for the selected date.</div>
      )}
    </section>
  );
};

export default BookingPage;
