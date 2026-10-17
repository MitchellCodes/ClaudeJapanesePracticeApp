import type { ItemType, StudyItem } from '../data'
import type { StatsMap } from '../stats/StatsRepository'

export type Direction = 'toEnglish' | 'toJapanese'

export interface Option {
  item: StudyItem
  label: string
}

export interface Question {
  item: StudyItem
  direction: Direction
  prompt: string
  options: Option[]
  correctIndex: number
}

type Rng = () => number

/** What the learner is shown/chooses when the Japanese side is "answered". */
export const englishSide = (item: StudyItem) => (isKana(item.type) ? item.romaji : item.en)
const isKana = (t: ItemType) => t === 'hiragana' || t === 'katakana'

export function shuffle<T>(arr: T[], rng: Rng = Math.random): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Weak and unseen items are more likely to come up. */
export function itemWeight(stats: StatsMap, id: string): number {
  const s = stats[id]
  const attempts = s ? s.c + s.w : 0
  if (!s || attempts === 0) return 4
  const rate = s.c / attempts
  return 0.5 + 3 * (1 - rate) + (attempts < 3 ? 1 : 0)
}

export function pickItem(
  pool: StudyItem[],
  stats: StatsMap,
  avoidId?: string,
  rng: Rng = Math.random,
): StudyItem {
  const candidates = pool.length > 1 ? pool.filter((i) => i.id !== avoidId) : pool
  const weights = candidates.map((i) => itemWeight(stats, i.id))
  let r = rng() * weights.reduce((a, b) => a + b, 0)
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i]
    if (r <= 0) return candidates[i]
  }
  return candidates[candidates.length - 1]
}

export function buildQuestion(
  item: StudyItem,
  all: StudyItem[],
  direction: Direction,
  rng: Rng = Math.random,
): Question {
  const label = (i: StudyItem) => (direction === 'toEnglish' ? englishSide(i) : i.jp)
  const correctLabel = label(item)

  const seen = new Set([correctLabel])
  const distractors: Option[] = []
  for (const cand of shuffle(
    all.filter((i) => i.type === item.type && i.id !== item.id),
    rng,
  )) {
    const l = label(cand)
    if (seen.has(l)) continue
    seen.add(l)
    distractors.push({ item: cand, label: l })
    if (distractors.length === 3) break
  }

  const options = shuffle([{ item, label: correctLabel }, ...distractors], rng)
  return {
    item,
    direction,
    prompt: direction === 'toEnglish' ? item.jp : englishSide(item),
    options,
    correctIndex: options.findIndex((o) => o.item.id === item.id),
  }
}

export function nextQuestion(
  pool: StudyItem[],
  stats: StatsMap,
  avoidId?: string,
  rng: Rng = Math.random,
): Question {
  const item = pickItem(pool, stats, avoidId, rng)
  const direction: Direction = rng() < 0.5 ? 'toEnglish' : 'toJapanese'
  return buildQuestion(item, pool, direction, rng)
}
