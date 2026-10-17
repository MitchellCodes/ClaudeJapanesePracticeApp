import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Home from './screens/Home'
import Library from './screens/Library'
import Flashcards from './screens/Flashcards'
import Game from './screens/Game'
import { useInstallPrompt } from './hooks/useInstallPrompt'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/library', label: 'Library' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/game', label: 'Game' },
]

export default function App() {
  const { canInstall, install } = useInstallPrompt()
  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">N5 Practice</span>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        {canInstall && (
          <button className="btn small" onClick={install}>
            Install app
          </button>
        )}
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
