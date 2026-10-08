import { motion } from 'framer-motion'
import { Check, HeartCrack, Lock, Play } from 'lucide-react'
import { units } from '../data/index.js'
import { useGameStore } from '../store/useGameStore.js'

// Zigzag offsets for the Duolingo-style path.
const offsets = ['', 'sm:translate-x-12', '', 'sm:-translate-x-12']

export default function Home() {
  const hearts = useGameStore((s) => s.hearts)
  const completedUnits = useGameStore((s) => s.completedUnits)
  const startQuiz = useGameStore((s) => s.startQuiz)
  const resetHearts = useGameStore((s) => s.resetHearts)

  return (
    <div className="flex flex-col gap-8">
      {hearts === 0 && (
        <div className="card flex flex-col items-center gap-3 border-danger text-center sm:flex-row sm:text-left">
          <HeartCrack className="h-10 w-10 shrink-0 text-danger" aria-hidden="true" />
          <p className="flex-1 font-bold text-gray-700">You have no hearts left. Refill them to start a lesson.</p>
          <button type="button" className="btn bg-danger" onClick={resetHearts}>
            Refill hearts
          </button>
        </div>
      )}

      <ol className="flex flex-col items-center gap-6">
        {units.map((unit, i) => {
          const completed = completedUnits.includes(unit.unitId)
          const unlocked = i === 0 || completedUnits.includes(units[i - 1].unitId)
          const Icon = completed ? Check : unlocked ? Play : Lock
          const color = completed ? 'bg-primary' : unlocked ? 'bg-accent' : 'bg-gray-300'
          return (
            <motion.li
              key={unit.unitId}
              className="w-full max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <button
                type="button"
                className={`card flex w-full items-center gap-4 text-left transition ${offsets[i % offsets.length]} ${unlocked ? 'hover:-translate-y-0.5' : 'cursor-not-allowed opacity-60'}`}
                disabled={!unlocked || hearts === 0}
                onClick={() => startQuiz(unit.unitId)}
              >
                <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-white shadow-btn ${color}`}>
                  <Icon className="h-8 w-8" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-bold uppercase text-gray-400">
                    Unit {i + 1} · {completed ? 'Completed' : unlocked ? 'Start' : 'Locked'}
                  </span>
                  <span className="block text-lg font-extrabold text-gray-800">{unit.unitTitle}</span>
                  <span className="block text-sm text-gray-500">{unit.description}</span>
                </span>
              </button>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
