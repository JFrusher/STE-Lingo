import { HeartCrack, Target, Trophy, Zap } from 'lucide-react'
import { useState } from 'react'
import { getUnit } from '../data/index.js'
import { XP_PER_CORRECT, correctAnswerText } from '../store/rules.js'
import { useGameStore } from '../store/useGameStore.js'

export default function SummaryView() {
  const quiz = useGameStore((s) => s.activeQuiz)
  const exitQuiz = useGameStore((s) => s.exitQuiz)
  const [showMistakes, setShowMistakes] = useState(false)

  const unit = getUnit(quiz.unitId)
  const answeredCount = quiz.correctCount + quiz.wrongIds.length
  const accuracy = answeredCount === 0 ? 0 : Math.round((quiz.correctCount / answeredCount) * 100)
  const mistakes = unit.questions.filter((q) => quiz.wrongIds.includes(q.id))

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {quiz.passed ? (
        <Trophy className="h-20 w-20 text-warning" aria-hidden="true" />
      ) : (
        <HeartCrack className="h-20 w-20 text-danger" aria-hidden="true" />
      )}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-800">{quiz.passed ? 'Lesson complete!' : 'Out of hearts'}</h1>
        <p className="mt-1 text-gray-500">{unit.unitTitle}</p>
      </div>

      <div className="grid w-full grid-cols-2 gap-4">
        <div className="card flex flex-col items-center gap-1 border-accent">
          <Zap className="h-8 w-8 text-accent" fill="currentColor" aria-hidden="true" />
          <span className="text-2xl font-extrabold text-accent">+{quiz.correctCount * XP_PER_CORRECT}</span>
          <span className="text-sm font-bold uppercase text-gray-500">XP gained</span>
        </div>
        <div className="card flex flex-col items-center gap-1 border-primary">
          <Target className="h-8 w-8 text-primary" aria-hidden="true" />
          <span className="text-2xl font-extrabold text-primary">{accuracy}%</span>
          <span className="text-sm font-bold uppercase text-gray-500">Accuracy</span>
        </div>
      </div>

      {showMistakes && (
        <ul className="flex w-full flex-col gap-3 text-left">
          {mistakes.map((q) => (
            <li key={q.id} className="card border-danger/40">
              <p className="font-bold text-gray-800">{q.prompt}</p>
              <p className="mt-2 text-primary-dark">{correctAnswerText(q)}</p>
              <p className="mt-2 text-gray-600">{q.explanation}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        {mistakes.length > 0 && (
          <button
            type="button"
            className="btn flex-1 bg-accent"
            aria-expanded={showMistakes}
            onClick={() => setShowMistakes(!showMistakes)}
          >
            {showMistakes ? 'Hide mistakes' : `Review mistakes (${mistakes.length})`}
          </button>
        )}
        <button type="button" className="btn flex-1 bg-primary" onClick={exitQuiz}>
          Back to home
        </button>
      </div>
    </div>
  )
}
