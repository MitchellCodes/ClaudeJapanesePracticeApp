import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ItemType } from '../data'
import CategoryPicker, { poolFor } from '../components/CategoryPicker'
import { shuffle } from '../lib/quiz'

/** Practice mode: deliberately never reads or writes progress stats. */
export default function Flashcards() {
  const [types, setTypes] = useState<ItemType[]>(['hiragana'])
  const [seed, setSeed] = useState(0)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  // `seed` is bumped to reshuffle the same categories.
  const deck = useMemo(() => shuffle(poolFor(types)), [types, seed])
  const card = deck[index]

  const go = useCallback(
    (delta: number) => {
      setFlipped(false)
      setIndex((i) => (i + delta + deck.length) % deck.length)
    },
    [deck.length],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === ' ' && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault()
        setFlipped((f) => !f)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const restart = (next?: ItemType[]) => {
    if (next) setTypes(next)
    setSeed((s) => s + 1)
    setIndex(0)
    setFlipped(false)
  }

  const isKana = card.type === 'hiragana' || card.type === 'katakana'

  return (
    <section>
      <h1>Flashcards</h1>
      <p className="muted">Practice freely. Your stats are not affected in this mode.</p>
      <CategoryPicker selected={types} onChange={(t) => restart(t)} />

      <div className="deck-meta">
        Card {index + 1} of {deck.length}
      </div>

      <button
        className={`flip ${flipped ? 'is-flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? 'Show front of card' : 'Flip card to see translation'}
      >
        <span className="flip-inner">
          <span className="flip-face front">
            <span className="flip-jp">{card.jp}</span>
            <span className="flip-hint">Tap to flip</span>
          </span>
          <span className="flip-face back">
            {card.reading && <span className="flip-reading">{card.reading}</span>}
            <span className="flip-main">{isKana ? card.romaji : card.en}</span>
            {!isKana && <span className="flip-sub">{card.romaji}</span>}
          </span>
        </span>
      </button>

      <div className="row">
        <button className="btn secondary" onClick={() => go(-1)}>
          Previous
        </button>
        <button className="btn secondary" onClick={() => restart()}>
          Shuffle
        </button>
        <button className="btn" onClick={() => go(1)}>
          Next
        </button>
      </div>
      <p className="muted small-print">Keyboard: arrow keys to move, space to flip.</p>
    </section>
  )
}
