import { useCallback, useEffect, useState } from 'react'
import type { ItemType } from '../data'
import CategoryPicker, { poolFor } from '../components/CategoryPicker'
import { nextQuestion, type Question } from '../lib/quiz'
import { useStats } from '../stats/StatsContext'

interface Session {
  types: ItemType[]
  answered: number
  correct: number
  streak: number
  best: number
}

const NEW_SESSION = (types: ItemType[]): Session => ({ types, answered: 0, correct: 0, streak: 0, best: 0 })

export default function Game() {
  const { stats, record } = useStats()
  const [types, setTypes] = useState<ItemType[]>(['hiragana', 'katakana', 'kanji', 'word'])
  const [session, setSession] = useState<Session | null>(null)
  const [summary, setSummary] = useState<Session | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const [picked, setPicked] = useState<number | null>(null)

  const start = () => {
    const s = NEW_SESSION(types)
    setSummary(null)
    setSession(s)
    setPicked(null)
    setQuestion(nextQuestion(poolFor(types), stats))
  }

  const answer = useCallback(
    (index: number) => {
      if (!question || !session || picked !== null) return
      const ok = index === question.correctIndex
      record(question.item.id, ok)
      setPicked(index)
      setSession((s) => {
        if (!s) return s
        const streak = ok ? s.streak + 1 : 0
        return { ...s, answered: s.answered + 1, correct: s.correct + (ok ? 1 : 0), streak, best: Math.max(s.best, streak) }
      })
    },
    [question, session, picked, record],
  )

  const next = useCallback(() => {
    if (!session) return
    setPicked(null)
    setQuestion((q) => nextQuestion(poolFor(session.types), stats, q?.item.id))
  }, [session, stats])

  const end = () => {
    setSummary(session)
    setSession(null)
    setQuestion(null)
    setPicked(null)
  }

  useEffect(() => {
    if (!session) return
    const onKey = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) answer(Number(e.key) - 1)
      else if ((e.key === 'Enter' || e.key === ' ') && picked !== null) {
        e.preventDefault()
        next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [session, picked, answer, next])

  if (!session || !question) {
    return (
      <section>
        <h1>Game</h1>
        {summary && (
          <div className="card summary">
            <h2>Session complete</h2>
            <div className="stat-row">
              <div>
                <strong>{summary.correct}</strong>
                <span>correct</span>
              </div>
              <div>
                <strong>{summary.answered}</strong>
                <span>answered</span>
              </div>
              <div>
                <strong>{summary.answered ? Math.round((summary.correct / summary.answered) * 100) : 0}%</strong>
                <span>accuracy</span>
              </div>
              <div>
                <strong>{summary.best}</strong>
                <span>best streak</span>
              </div>
            </div>
          </div>
        )}
        <p className="muted">
          Pick the right answer from four choices. Questions run in both directions, and items you
          struggle with come up more often. Your results update your Library colors.
        </p>
        <CategoryPicker selected={types} onChange={setTypes} />
        <div className="row">
          <button className="btn" onClick={start}>
            {summary ? 'Play again' : 'Start'}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="game-head">
        <div className="score">
          <span>
            Score <strong>{session.correct}</strong>/{session.answered}
          </span>
          <span>
            Streak <strong>{session.streak}</strong>
          </span>
        </div>
        <button className="btn small secondary" onClick={end}>
          End session
        </button>
      </div>

      <div className="card question">
        <div className={`prompt ${question.direction === 'toEnglish' ? 'jp' : ''}`}>{question.prompt}</div>
        <div className="muted">
          {question.direction === 'toEnglish'
            ? question.item.type === 'hiragana' || question.item.type === 'katakana'
              ? 'Choose the romaji'
              : 'Choose the meaning'
            : 'Choose the Japanese'}
        </div>
      </div>

      <div className="options">
        {question.options.map((o, i) => {
          const state =
            picked === null ? '' : i === question.correctIndex ? 'correct' : i === picked ? 'wrong' : 'dim'
          return (
            <button
              key={o.item.id}
              className={`option ${state} ${question.direction === 'toJapanese' ? 'jp' : ''}`}
              disabled={picked !== null}
              onClick={() => answer(i)}
            >
              <kbd>{i + 1}</kbd>
              <span>{o.label}</span>
            </button>
          )
        })}
      </div>

      <div className={`feedback ${picked === null ? 'hidden' : picked === question.correctIndex ? 'ok' : 'bad'}`} aria-live="polite">
        {picked !== null &&
          (picked === question.correctIndex ? 'Correct!' : `Not quite. Answer: ${question.options[question.correctIndex].label}`)}
      </div>

      <div className="row">
        <button className="btn" onClick={next} disabled={picked === null}>
          Next
        </button>
      </div>
    </section>
  )
}
