import { motion } from 'framer-motion'
import { CircleCheck, CircleX } from 'lucide-react'
import { correctAnswerText, wordLimitProblems } from '../../store/rules.js'

export default function FeedbackModal({ correct, question, answer, onContinue }) {
  const Icon = correct ? CircleCheck : CircleX
  return (
    <motion.div
      role="dialog"
      aria-label={correct ? 'Correct' : 'Incorrect'}
      className={`fixed inset-x-0 bottom-0 z-20 border-t-2 ${correct ? 'border-green-200 bg-green-100' : 'border-red-200 bg-red-100'}`}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-end sm:justify-between">
        <div className={`flex gap-3 ${correct ? 'text-primary-dark' : 'text-danger-dark'}`}>
          <Icon className="h-10 w-10 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-2xl font-extrabold">{correct ? 'Correct!' : 'Not quite.'}</p>
            {!correct && (
              <>
                {question.type === 'word_limit' && (
                  <>
                    <p className="mt-2 font-bold">What to fix:</p>
                    <ul className="list-inside list-disc">
                      {wordLimitProblems(question, answer).map((problem) => (
                        <li key={problem}>{problem}</li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="mt-2 font-bold">Correct answer:</p>
                <p>{correctAnswerText(question)}</p>
                <p className="mt-2 font-bold">STE rule:</p>
                <p>{question.explanation}</p>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          // Focus the next action so keyboard users can continue right away.
          autoFocus
          className={`btn shrink-0 ${correct ? 'bg-primary' : 'bg-danger'}`}
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </motion.div>
  )
}
