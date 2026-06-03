import { useEffect, useState } from 'react';
import { fetchJson, normalizeList } from '../lib/api.js';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchJson('/teams');
        setTeams(normalizeList(data));
      } catch (err) {
        setError(err.message);
      }
    };

    load();
  }, []);

  return (
    <section className="card shadow-sm p-4">
      <h2>Teams</h2>
      <p className="text-muted">Current squads and captain points.</p>
      {error ? <p className="text-danger">{error}</p> : null}
      <ul className="list-unstyled mb-0 mt-3">
        {teams.map((team) => (
          <li key={team._id || team.name} className="team-item">
            <strong>{team.name}</strong>
            <span>Captain: {team.captain}</span>
            <span>{team.points} pts · {team.members?.length ?? 0} members</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
