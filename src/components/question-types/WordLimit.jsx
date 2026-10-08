import { countWords } from '../../store/rules.js'

export default function WordLimit({ question, answer, onChange, disabled }) {
  const words = countWords(answer)
  const withinLimit = words <= question.maxWords
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={`edit-${question.id}`} className="sr-only">
        Your edited step
      </label>
      <textarea
        id={`edit-${question.id}`}
        className="min-h-40 w-full rounded-card border-2 border-gray-200 bg-gray-50 p-4 text-lg focus:border-accent focus:outline-none"
        value={answer}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
      <span
        className={`self-end rounded-full px-3 py-1 text-sm font-bold text-white ${withinLimit ? 'bg-primary' : 'bg-danger'}`}
        aria-live="polite"
      >
        {words} / {question.maxWords} words
      </span>
    </div>
  )
}
