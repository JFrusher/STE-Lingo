import { Flame } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore.js'
import { currentStreak, localDay } from '../../store/rules.js'

export default function StreakBadge() {
  const streak = useGameStore((s) => currentStreak(s.streak, s.lastActiveDate, localDay()))
  return (
    <div
      className={`flex items-center gap-1 font-bold ${streak > 0 ? 'text-warning' : 'text-gray-400'}`}
    >
      <Flame className="h-6 w-6" fill={streak > 0 ? 'currentColor' : 'none'} aria-hidden="true" />
      <span>
        {streak}
        <span className="sr-only"> day streak</span>
      </span>
    </div>
  )
}
