import { useEffect, useState } from 'react';
import { fetchJson, normalizeList } from '../lib/api.js';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchJson('/users');
        setUsers(normalizeList(data));
      } catch (err) {
        setError(err.message);
      }
    };

    load();
  }, []);

  return (
    <section className="card shadow-sm p-4">
      <h2>Users</h2>
      <p className="text-muted">Profile and scoring overview for tracked participants.</p>
      {error ? <p className="text-danger">{error}</p> : null}
      <ul className="list-unstyled mb-0 mt-3">
        {users.map((user) => (
          <li key={user._id || user.email} className="team-item">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
            <span>{user.role} · {user.points} pts</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
