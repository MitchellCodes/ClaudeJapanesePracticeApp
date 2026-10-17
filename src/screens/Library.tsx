import { useEffect, useMemo, useState } from 'react'
import { ITEMS_BY_TYPE, TYPE_LABELS, type ItemType, type StudyItem } from '../data'
import { getMastery } from '../lib/color'
import { useStats } from '../stats/StatsContext'
import ColorLegend from '../components/ColorLegend'
import { ALL_TYPES } from '../components/CategoryPicker'

const isKana = (t: ItemType) => t === 'hiragana' || t === 'katakana'

function masteryStyle(hue: number | undefined) {
  return hue === undefined ? undefined : ({ '--h': hue } as React.CSSProperties)
}

function Tile({ item, onOpen }: { item: StudyItem; onOpen: () => void }) {
  const { stats } = useStats()
  const m = getMastery(stats[item.id])
  const sub = isKana(item.type) ? item.romaji : item.en
  return (
    <button
      className={`tile ${m.hue === undefined ? 'unseen' : ''} ${item.type === 'word' ? 'wide' : ''}`}
      style={masteryStyle(m.hue)}
      onClick={onOpen}
      aria-label={`${item.jp}, ${sub}, ${m.label}`}
    >
      <span className="tile-jp">{item.jp}</span>
      <span className="tile-sub">{sub}</span>
      {m.rate !== null && <span className="tile-pct">{Math.round(m.rate * 100)}%</span>}
    </button>
  )
}

function Detail({ item, onClose }: { item: StudyItem; onClose: () => void }) {
  const { stats } = useStats()
  const s = stats[item.id]
  const m = getMastery(s)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail-jp">{item.jp}</div>
        {item.reading && <div className="detail-reading">{item.reading}</div>}
        <dl className="detail-list">
          <dt>Romaji</dt>
          <dd>{item.romaji}</dd>
          {item.en && (
            <>
              <dt>Meaning</dt>
              <dd>{item.en}</dd>
            </>
          )}
          <dt>Success rate</dt>
          <dd>
            <span
              className={`badge ${m.hue === undefined ? 'unseen' : ''}`}
              style={masteryStyle(m.hue)}
            >
              {m.label}
            </span>{' '}
            {m.rate !== null && `${Math.round(m.rate * 100)}% (${s!.c} of ${m.attempts} correct)`}
            {m.rate === null && 'Not attempted yet'}
          </dd>
        </dl>
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default function Library() {
  const [type, setType] = useState<ItemType>('hiragana')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<StudyItem | null>(null)

  const items = ITEMS_BY_TYPE[type]
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((i) =>
      [i.jp, i.reading ?? '', i.romaji, i.en].some((f) => f.toLowerCase().includes(q)),
    )
  }, [items, query])

  const groups = useMemo(() => {
    const map = new Map<string, StudyItem[]>()
    for (const i of filtered) {
      const g = i.group ?? ''
      map.set(g, [...(map.get(g) ?? []), i])
    }
    return [...map.entries()]
  }, [filtered])

  return (
    <section>
      <h1>Library</h1>
      <div className="tabs" role="tablist">
        {ALL_TYPES.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={t === type}
            className={t === type ? 'active' : ''}
            onClick={() => setType(t)}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>
      <div className="toolbar">
        <input
          type="search"
          placeholder={`Search ${TYPE_LABELS[type].toLowerCase()}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search"
        />
        <ColorLegend />
      </div>
      {filtered.length === 0 && <p className="muted">Nothing matches your search.</p>}
      {groups.map(([group, list]) => (
        <div key={group}>
          {group && <h2 className="group-title">{group}</h2>}
          <div className={`grid ${type === 'word' ? 'grid-wide' : ''}`}>
            {list.map((i) => (
              <Tile key={i.id} item={i} onOpen={() => setOpen(i)} />
            ))}
          </div>
        </div>
      ))}
      {open && <Detail item={open} onClose={() => setOpen(null)} />}
    </section>
  )
}
