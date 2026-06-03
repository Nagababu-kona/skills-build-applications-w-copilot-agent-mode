import { useEffect, useState } from 'react';
import { fetchJson, normalizeList } from '../lib/api.js';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchJson('/workouts');
        setWorkouts(normalizeList(data));
      } catch (err) {
        setError(err.message);
      }
    };

    load();
  }, []);

  return (
    <section className="card shadow-sm p-4">
      <h2>Workouts</h2>
      <p className="text-muted">Suggested training sessions tailored for the current season.</p>
      {error ? <p className="text-danger">{error}</p> : null}
      <ul className="list-unstyled mb-0 mt-3">
        {workouts.map((workout) => (
          <li key={workout._id || workout.title} className="activity-item">
            <strong>{workout.title}</strong>
            <span>{workout.category} · {workout.durationMinutes} min</span>
            <span>{workout.difficulty} · {workout.focus}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
