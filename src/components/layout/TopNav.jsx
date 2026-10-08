import { Volume2, VolumeX } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore.js'
import StatHeader from '../common/StatHeader.jsx'

export default function TopNav() {
  const soundOn = useGameStore((s) => s.soundOn)
  const toggleSound = useGameStore((s) => s.toggleSound)
  const SoundIcon = soundOn ? Volume2 : VolumeX
  return (
    <header className="sticky top-0 z-10 border-b-2 border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
        <span className="text-xl font-extrabold text-primary">STE-Lingo</span>
        <div className="flex items-center gap-2 sm:gap-4">
          <StatHeader />
          <button
            type="button"
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
            onClick={toggleSound}
          >
            <SoundIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}
