import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [activities, setActivities] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [teams, setTeams] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const [activitiesRes, leaderboardRes, teamsRes] = await Promise.all([
        fetch('/api/activities'),
        fetch('/api/leaderboard'),
        fetch('/api/teams'),
      ])

      setActivities(await activitiesRes.json())
      setLeaderboard(await leaderboardRes.json())
      setTeams(await teamsRes.json())
    }

    loadData()
  }, [])

  return (
    <main className="octofit-shell">
      <section className="hero-card card shadow-sm p-4 mb-4">
        <p className="eyebrow">OctoFit Tracker</p>
        <h1>Fitness challenges, team spirit, and progress at a glance.</h1>
        <p className="lead">This dashboard pulls live activity and leaderboard data from the backend API.</p>
      </section>

      <section className="row g-4 mb-4">
        <article className="col-md-4">
          <div className="card shadow-sm p-3 h-100">
            <h2>Recent activity</h2>
            <ul className="list-unstyled mb-0">
              {activities.map((item) => (
                <li key={item._id} className="activity-item">
                  <strong>{item.student}</strong> — {item.activity} ({item.durationMinutes} min)
                  <span className="badge text-bg-success">+{item.points} pts</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="col-md-4">
          <div className="card shadow-sm p-3 h-100">
            <h2>Leaderboard</h2>
            <ol className="mb-0 ps-3">
              {leaderboard.map((entry, index) => (
                <li key={entry._id} className="leaderboard-item">
                  <span>{entry._id}</span>
                  <strong>{entry.totalPoints} pts</strong>
                  <small>{entry.workouts} workouts</small>
                  <span className="rank-pill">#{index + 1}</span>
                </li>
              ))}
            </ol>
          </div>
        </article>

        <article className="col-md-4">
          <div className="card shadow-sm p-3 h-100">
            <h2>Teams</h2>
            <ul className="list-unstyled mb-0">
              {teams.map((team) => (
                <li key={team._id} className="team-item">
                  <strong>{team.name}</strong>
                  <span>Captain: {team.captain}</span>
                  <span>{team.points} pts</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>
    </main>
  )
}

export default App
