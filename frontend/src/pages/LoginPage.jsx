import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ErrorState from '../components/ErrorState';
import { isValidEmail, setStoredUser } from '../utils/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const redirectTo = useMemo(() => {
    const path = new URLSearchParams(location.search).get('redirect');
    return path && path.startsWith('/') ? path : '/experts';
  }, [location.search]);

  const onSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!isValidEmail(form.email)) {
      setError('Valid email is required');
      return;
    }

    if (!form.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    setStoredUser({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim()
    });

    navigate(redirectTo, { replace: true });
  };

  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <h2>User Login</h2>
        <p>Sign in to book sessions and track your bookings.</p>

        {error && <ErrorState message={error} />}

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

          <button type="submit">Continue</button>
        </form>

        <div className="auth-links">
          <Link to="/experts" className="ghost-button">
            Browse experts first
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
