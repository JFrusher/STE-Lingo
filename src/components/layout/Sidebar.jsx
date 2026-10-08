import { RotateCcw } from 'lucide-react'
import { units } from '../../data/index.js'
import { useGameStore } from '../../store/useGameStore.js'
import ProgressBar from '../common/ProgressBar.jsx'

export default function Sidebar() {
  const completedCount = useGameStore((s) => s.completedUnits.length)
  const xp = useGameStore((s) => s.xp)
  const resetProgress = useGameStore((s) => s.resetProgress)

  function confirmReset() {
    if (window.confirm('Reset all progress? This deletes your XP, streak and completed units.')) resetProgress()
  }

  return (
    <aside className="card flex flex-col gap-4 lg:sticky lg:top-24">
      <h2 className="text-lg font-extrabold text-gray-800">Your progress</h2>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-gray-500">
          {completedCount} of {units.length} units complete
        </p>
        <ProgressBar value={completedCount / units.length} label="Units complete" />
      </div>
      <p className="text-sm font-bold text-gray-500">{xp} XP earned in total</p>
      <button
        type="button"
        className="flex items-center gap-2 self-start rounded-card px-2 py-2 text-sm font-bold text-gray-400 hover:bg-gray-100 hover:text-danger"
        onClick={confirmReset}
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset progress
      </button>
    </aside>
  )
}
