import { useEffect, useState } from 'react';
import { fetchJson, normalizeList } from '../lib/api.js';

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchJson('/leaderboard');
        setEntries(normalizeList(data));
      } catch (err) {
        setError(err.message);
      }
    };

    load();
  }, []);

  return (
    <section className="card shadow-sm p-4">
      <h2>Leaderboard</h2>
      <p className="text-muted">Top performers based on total points and completed workouts.</p>
      {error ? <p className="text-danger">{error}</p> : null}
      <ol className="mb-0 ps-3 mt-3">
        {entries.map((entry, index) => (
          <li key={entry._id || `${entry.student}-${index}`} className="leaderboard-item">
            <span>{entry.student || entry._id}</span>
            <strong>{entry.totalPoints ?? entry.points} pts</strong>
            <small>{entry.workouts ?? 0} workouts</small>
            <span className="rank-pill">#{index + 1}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
