import { describe, expect, it } from 'vitest'
import { ALL_ITEMS, ITEMS_BY_TYPE } from '../data'
import { getMastery } from './color'
import { buildQuestion, itemWeight, nextQuestion } from './quiz'
import { LocalStatsRepository, mergeStats } from '../stats/StatsRepository'

function memoryStorage() {
  const m = new Map<string, string>()
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  }
}

describe('data', () => {
  it('has unique ids', () => {
    const ids = ALL_ITEMS.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('has the expected content sizes', () => {
    expect(ITEMS_BY_TYPE.hiragana.length).toBe(ITEMS_BY_TYPE.katakana.length)
    expect(ITEMS_BY_TYPE.kanji.length).toBeGreaterThanOrEqual(80)
    expect(ITEMS_BY_TYPE.word.length).toBeGreaterThanOrEqual(200)
  })
  it('derives katakana from hiragana', () => {
    expect(ITEMS_BY_TYPE.katakana[0].jp).toBe('ア')
    expect(ITEMS_BY_TYPE.katakana.find((i) => i.romaji === 'kya')?.jp).toBe('キャ')
  })
})

describe('quiz', () => {
  it.each(['toEnglish', 'toJapanese'] as const)('builds 4 unique options incl. the answer (%s)', (dir) => {
    for (const item of ALL_ITEMS) {
      const q = buildQuestion(item, ITEMS_BY_TYPE[item.type], dir)
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options.map((o) => o.label)).size).toBe(4)
      expect(q.options[q.correctIndex].item.id).toBe(item.id)
    }
  })
  it('does not repeat the previous item', () => {
    const pool = ITEMS_BY_TYPE.hiragana
    for (let i = 0; i < 50; i++) {
      expect(nextQuestion(pool, {}, pool[0].id).item.id).not.toBe(pool[0].id)
    }
  })
  it('weights weak and unseen items higher than mastered ones', () => {
    const stats = {
      weak: { c: 1, w: 9, t: 1, u: 1 },
      strong: { c: 9, w: 1, t: 1, u: 1 },
    }
    expect(itemWeight(stats, 'weak')).toBeGreaterThan(itemWeight(stats, 'strong'))
    expect(itemWeight(stats, 'unseen')).toBeGreaterThan(itemWeight(stats, 'weak'))
  })
})

describe('color', () => {
  it('reports unseen items with no hue', () => {
    expect(getMastery(undefined)).toMatchObject({ rate: null, label: 'New' })
  })
  it('maps accuracy to hue from red to green', () => {
    expect(getMastery({ c: 0, w: 5, t: 1, u: 1 }).hue).toBe(0)
    expect(getMastery({ c: 5, w: 0, t: 1, u: 1 }).hue).toBe(120)
    expect(getMastery({ c: 5, w: 0, t: 1, u: 1 }).label).toBe('Mastered')
  })
})

describe('stats repository', () => {
  it('records, persists and resets', () => {
    const storage = memoryStorage()
    const repo = new LocalStatsRepository(storage)
    repo.record('a', true)
    repo.record('a', false)
    expect(repo.get('a')).toMatchObject({ c: 1, w: 1 })
    expect(new LocalStatsRepository(storage).get('a')).toMatchObject({ c: 1, w: 1 })
    repo.reset()
    expect(repo.getAll()).toEqual({})
  })
  it('notifies subscribers with a new snapshot', () => {
    const repo = new LocalStatsRepository(memoryStorage())
    const before = repo.getAll()
    let calls = 0
    repo.subscribe(() => calls++)
    repo.record('a', true)
    expect(calls).toBe(1)
    expect(repo.getAll()).not.toBe(before)
  })
  it('merges by most recent update', () => {
    const merged = mergeStats(
      { a: { c: 1, w: 0, t: 1, u: 1 }, b: { c: 1, w: 0, t: 1, u: 5 } },
      { a: { c: 2, w: 0, t: 2, u: 2 }, b: { c: 9, w: 9, t: 1, u: 1 }, c: { c: 1, w: 1, t: 1, u: 1 } },
    )
    expect(merged.a.c).toBe(2)
    expect(merged.b.c).toBe(1)
    expect(merged.c).toBeDefined()
  })
})
