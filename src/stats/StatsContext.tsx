import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { LocalStatsRepository, type StatsMap, type StatsRepository } from './StatsRepository'

interface StatsContextValue {
  stats: StatsMap
  record: (id: string, correct: boolean) => void
  reset: () => void
}

const StatsContext = createContext<StatsContextValue | null>(null)

export function StatsProvider({
  children,
  repository,
}: {
  children: ReactNode
  repository?: StatsRepository
}) {
  const repo = useMemo(() => repository ?? new LocalStatsRepository(), [repository])
  const stats = useSyncExternalStore(
    (cb) => repo.subscribe(cb),
    () => repo.getAll(),
  )
  const value = useMemo<StatsContextValue>(
    () => ({ stats, record: (id, ok) => repo.record(id, ok), reset: () => repo.reset() }),
    [stats, repo],
  )
  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
}

export function useStats(): StatsContextValue {
  const ctx = useContext(StatsContext)
  if (!ctx) throw new Error('useStats must be used inside StatsProvider')
  return ctx
}
