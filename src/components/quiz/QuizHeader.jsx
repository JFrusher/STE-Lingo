import { X } from 'lucide-react'
import ProgressBar from '../common/ProgressBar.jsx'

export default function QuizHeader({ progress, onExit }) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label="Exit lesson"
        onClick={onExit}
      >
        <X className="h-7 w-7" aria-hidden="true" />
      </button>
      <ProgressBar value={progress} label="Lesson progress" />
    </div>
  )
}
