import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const REFRESH_INTERVAL_MS = 5000;

const ExpertDetailPage = () => {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [liveMessage, setLiveMessage] = useState('Availability refreshes automatically every 5 seconds.');

  useEffect(() => {
    let intervalId;
    let cancelled = false;

    const fetchExpert = async (showLoading = false) => {
      if (showLoading) {
        setLoading(true);
      }

      setError('');

      try {
        const response = await api.get(`/experts/${id}`);

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
  }, [id]);

  if (loading) {
    return <LoadingState text="Loading expert profile..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!expert) {
    return null;
  }

  return (
    <section className="detail-wrap">
      <div className="detail-head">
        <div>
          <h2>{expert.name}</h2>
          <p>{expert.bio || 'No bio available.'}</p>
        </div>
        <div className="pill-group">
          <span className="chip">{expert.category}</span>
          <span className="chip">{expert.experience} years</span>
          <span className="chip">{expert.rating}/5</span>
        </div>
      </div>

      {liveMessage && <div className="live-banner">{liveMessage}</div>}

      <h3>Available Time Slots</h3>
      <div className="slot-groups">
        {expert.slotAvailability?.map((group) => (
          <div key={group.date} className="slot-group">
            <h4>{group.date}</h4>
            <div className="slot-list">
              {group.slots.map((slot) => (
                <Link
                  key={slot.time}
                  to={
                    slot.isBooked
                      ? '#'
                      : `/book/${id}?date=${encodeURIComponent(group.date)}&time=${encodeURIComponent(slot.time)}`
                  }
                  className={`slot ${slot.isBooked ? 'booked' : ''}`}
                  onClick={(event) => {
                    if (slot.isBooked) {
                      event.preventDefault();
                    }
                  }}
                >
                  {slot.time} {slot.isBooked ? '(Booked)' : '(Book now)'}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExpertDetailPage;
