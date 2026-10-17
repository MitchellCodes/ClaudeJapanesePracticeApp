import { TYPE_LABELS, ITEMS_BY_TYPE, type ItemType, type StudyItem } from '../data'

export const ALL_TYPES: ItemType[] = ['hiragana', 'katakana', 'kanji', 'word']

export function poolFor(types: ItemType[]): StudyItem[] {
  return types.flatMap((t) => ITEMS_BY_TYPE[t])
}

interface Props {
  selected: ItemType[]
  onChange: (types: ItemType[]) => void
}

/** Multi-select chips; at least one category always stays selected. */
export default function CategoryPicker({ selected, onChange }: Props) {
  const toggle = (t: ItemType) => {
    const next = selected.includes(t) ? selected.filter((x) => x !== t) : [...selected, t]
    if (next.length > 0) onChange(ALL_TYPES.filter((x) => next.includes(x)))
  }
  return (
    <div className="chips" role="group" aria-label="Categories">
      {ALL_TYPES.map((t) => (
        <button
          key={t}
          className={`chip ${selected.includes(t) ? 'on' : ''}`}
          aria-pressed={selected.includes(t)}
          onClick={() => toggle(t)}
        >
          {TYPE_LABELS[t]}
          <span className="chip-count">{ITEMS_BY_TYPE[t].length}</span>
        </button>
      ))}
    </div>
  )
}
