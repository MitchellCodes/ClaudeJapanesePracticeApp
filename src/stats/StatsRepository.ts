/** Per-item practice record. Short keys keep the stored payload small. */
export interface ItemStats {
  /** correct answers */
  c: number
  /** wrong answers */
  w: number
  /** last attempt, epoch ms */
  t: number
  /** last modification, epoch ms. Used to resolve conflicts when merging remote data. */
  u: number
}

export type StatsMap = Record<string, ItemStats>

/**
 * Storage boundary for progress data. The UI only talks to this interface, so a
 * cloud-backed implementation can replace (or wrap) LocalStatsRepository later
 * without any screen changes. `mergeStats` below resolves per-item conflicts.
 */
export interface StatsRepository {
  getAll(): StatsMap
  get(id: string): ItemStats | undefined
  record(id: string, correct: boolean): void
  reset(): void
  /** Called after any change. Returns an unsubscribe function. */
  subscribe(listener: () => void): () => void
}

/** Per-item last-write-wins merge, for syncing a local and remote copy. */
export function mergeStats(a: StatsMap, b: StatsMap): StatsMap {
  const out: StatsMap = { ...a }
  for (const [id, s] of Object.entries(b)) {
    const mine = out[id]
    if (!mine || s.u > mine.u) out[id] = s
  }
  return out
}

const STORAGE_KEY = 'n5practice.stats.v1'

export class LocalStatsRepository implements StatsRepository {
  private data: StatsMap
  private listeners = new Set<() => void>()

  constructor(private storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null = safeStorage()) {
    this.data = this.load()
  }

  private load(): StatsMap {
    try {
      const raw = this.storage?.getItem(STORAGE_KEY)
      if (!raw) return {}
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object' ? (parsed as StatsMap) : {}
    } catch {
      return {}
    }
  }

  private save() {
    try {
      this.storage?.setItem(STORAGE_KEY, JSON.stringify(this.data))
    } catch {
      // Storage full or blocked: keep working in memory for this session.
    }
    this.listeners.forEach((l) => l())
  }

  getAll(): StatsMap {
    return this.data
  }

  get(id: string): ItemStats | undefined {
    return this.data[id]
  }

  record(id: string, correct: boolean): void {
    const now = Date.now()
    const prev = this.data[id] ?? { c: 0, w: 0, t: 0, u: 0 }
    // New object each time so React consumers see a changed reference.
    this.data = {
      ...this.data,
      [id]: { c: prev.c + (correct ? 1 : 0), w: prev.w + (correct ? 0 : 1), t: now, u: now },
    }
    this.save()
  }

  reset(): void {
    this.data = {}
    try {
      this.storage?.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    this.listeners.forEach((l) => l())
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}

function safeStorage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}
