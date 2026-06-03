import { useEffect, useState } from 'react';
import { fetchJson, normalizeList } from '../lib/api.js';

export default function Activities() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchJson('/activities');
        setItems(normalizeList(data));
      } catch (err) {
        setError(err.message);
      }
    };

    load();
  }, []);

  return (
    <section className="card shadow-sm p-4">
      <h2>Activities</h2>
      <p className="text-muted">Recent team activity and workout progress.</p>
      {error ? <p className="text-danger">{error}</p> : null}
      <ul className="list-unstyled mb-0 mt-3">
        {items.map((item) => (
          <li key={item._id || `${item.student}-${item.activity}`} className="activity-item">
            <strong>{item.student}</strong>
            <span>{item.activity} · {item.durationMinutes} min</span>
            <span className="badge text-bg-success">+{item.points} pts</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
