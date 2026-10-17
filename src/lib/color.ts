import type { ItemStats } from '../stats/StatsRepository'

export interface Mastery {
  /** null when the item has never been attempted. */
  rate: number | null
  attempts: number
  /** Hue 0 (red) to 120 (green); undefined for unseen items. */
  hue?: number
  label: 'New' | 'Needs work' | 'Learning' | 'Good' | 'Mastered'
}

export function getMastery(s: ItemStats | undefined): Mastery {
  const attempts = s ? s.c + s.w : 0
  if (!s || attempts === 0) return { rate: null, attempts: 0, label: 'New' }
  const rate = s.c / attempts
  const label: Mastery['label'] =
    rate < 0.4 ? 'Needs work' : rate < 0.7 ? 'Learning' : rate < 0.9 || attempts < 3 ? 'Good' : 'Mastered'
  return { rate, attempts, hue: Math.round(rate * 120), label }
}

export const LEGEND: { label: Mastery['label']; hue?: number }[] = [
  { label: 'New' },
  { label: 'Needs work', hue: 0 },
  { label: 'Learning', hue: 45 },
  { label: 'Good', hue: 90 },
  { label: 'Mastered', hue: 120 },
]
