import { NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './App.css'

function App() {
  return (
    <main className="octofit-shell">
      <section className="hero-card card shadow-sm p-4 mb-4 text-start">
        <p className="eyebrow">OctoFit Tracker</p>
        <h1>Fitness challenges, team spirit, and progress at a glance.</h1>
        <p className="lead">Navigate the activity, leaderboard, teams, users, and workout views from one dashboard.</p>
      </section>

      <nav className="nav nav-pills mb-4 gap-2">
        <NavLink className="nav-link btn btn-outline-primary" to="/">Home</NavLink>
        <NavLink className="nav-link btn btn-outline-primary" to="/activities">Activities</NavLink>
        <NavLink className="nav-link btn btn-outline-primary" to="/leaderboard">Leaderboard</NavLink>
        <NavLink className="nav-link btn btn-outline-primary" to="/teams">Teams</NavLink>
        <NavLink className="nav-link btn btn-outline-primary" to="/users">Users</NavLink>
        <NavLink className="nav-link btn btn-outline-primary" to="/workouts">Workouts</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<section className="row g-4"><article className="col-md-6"><Activities /></article><article className="col-md-6"><Leaderboard /></article></section>} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/users" element={<Users />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </main>
  )
}

export default App
