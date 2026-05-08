import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const categories = [
  'All',
  'Career Coaching',
  'Fitness',
  'Finance',
  'Mental Wellness',
  'Technology',
  'Nutrition'
];

const ExpertListPage = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const hasFilters = search.trim() !== '' || category !== 'All';

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '6');

    if (search.trim()) {
      params.set('search', search.trim());
    }

    if (category !== 'All') {
      params.set('category', category);
    }

    return params.toString();
  }, [page, search, category]);

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get(`/experts?${query}`);
        setExperts(response.data.data);
        setPagination(response.data.pagination);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load experts');
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, [query]);

  const onSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const onCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setPage(1);
  };

  return (
    <section>
      <div className="hero">
        <h2>Book sessions with top experts in real time</h2>
        <p>Search, filter, and secure your preferred slot instantly.</p>
        <div className="hero-metrics">
          <span className="chip">{pagination.total || 0} experts available</span>
          <span className="chip">Real-time slot updates</span>
          <span className="chip">No double booking</span>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by expert name"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button type="button" className="ghost-button" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <div className="list-toolbar">
        <span className="muted-copy">
          Showing {experts.length} of {pagination.total || 0} experts
          {hasFilters ? ' with active filters.' : '.'}
        </span>
      </div>

      {loading && <LoadingState text="Fetching experts..." />}
      {!loading && error && <ErrorState message={error} />}

      {!loading && !error && experts.length === 0 && (
        <div className="state">No experts found for this search criteria.</div>
      )}

      {!loading && !error && experts.length > 0 && (
        <>
          <div className="card-grid">
            {experts.map((expert) => (
              <article key={expert._id} className="expert-card">
                <span className="chip">{expert.category}</span>
                <h3>{expert.name}</h3>
                <p>{expert.bio || 'No bio available.'}</p>
                <div className="meta">
                  <strong>{expert.experience} years</strong>
                  <span>{expert.rating}/5 rating</span>
                </div>
                <Link to={`/experts/${expert._id}`} className="button-link">
                  View Details
                </Link>
              </article>
            ))}
          </div>

          <div className="pagination">
            <button type="button" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
              Previous
            </button>
            <span>
              Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
            </span>
            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default ExpertListPage;
