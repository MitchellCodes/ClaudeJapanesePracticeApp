import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ALL_ITEMS } from '../data'
import { getMastery, LEGEND } from '../lib/color'
import { useStats } from '../stats/StatsContext'

export default function Home() {
  const { stats, reset } = useStats()
  const [confirming, setConfirming] = useState(false)

  const counts = new Map<string, number>()
  for (const item of ALL_ITEMS) {
    const l = getMastery(stats[item.id]).label
    counts.set(l, (counts.get(l) ?? 0) + 1)
  }

  return (
    <section>
      <h1>Practice Japanese to JLPT N5</h1>
      <p className="muted">Hiragana, katakana, essential kanji and everyday vocabulary.</p>

      <div className="cards">
        <Link className="card link" to="/library">
          <h2>Library</h2>
          <p>Browse every character and word. Colors show how well you know each one.</p>
        </Link>
        <Link className="card link" to="/flashcards">
          <h2>Flashcards</h2>
          <p>Flip through cards at your own pace. Doesn't affect your stats.</p>
        </Link>
        <Link className="card link" to="/game">
          <h2>Game</h2>
          <p>Pick the correct answer from four choices and build a streak.</p>
        </Link>
      </div>

      <h2>Your progress</h2>
      <div className="progress">
        {LEGEND.map((l) => (
          <div className="progress-item" key={l.label}>
            <span
              className={`swatch ${l.hue === undefined ? 'unseen' : ''}`}
              style={l.hue === undefined ? undefined : ({ '--h': l.hue } as React.CSSProperties)}
            />
            <strong>{counts.get(l.label) ?? 0}</strong>
            <span className="muted">{l.label}</span>
          </div>
        ))}
      </div>

      <div className="row">
        {!confirming ? (
          <button className="btn secondary small" onClick={() => setConfirming(true)}>
            Reset progress
          </button>
        ) : (
          <>
            <span className="muted">Erase all stats on this device?</span>
            <button
              className="btn danger small"
              onClick={() => {
                reset()
                setConfirming(false)
              }}
            >
              Yes, erase
            </button>
            <button className="btn secondary small" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </>
        )}
      </div>
    </section>
  )
}
