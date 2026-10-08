import { Zap } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore.js'
import HeartBar from './HeartBar.jsx'
import StreakBadge from './StreakBadge.jsx'

export default function StatHeader() {
  const xp = useGameStore((s) => s.xp)
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <StreakBadge />
      <div className="flex items-center gap-1 font-bold text-accent" aria-label={`${xp} XP`}>
        <Zap className="h-6 w-6" fill="currentColor" aria-hidden="true" />
        <span aria-hidden="true">{xp}</span>
      </div>
      <HeartBar />
    </div>
  )
}
