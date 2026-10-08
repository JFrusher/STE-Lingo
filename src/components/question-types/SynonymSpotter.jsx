import { sentenceWords } from '../../store/rules.js'

// answer is the list of word indices the user flagged.
export default function SynonymSpotter({ question, answer, onChange, disabled }) {
  return (
    <div className="flex flex-wrap gap-2 text-lg">
      {sentenceWords(question.sentence).map((word, i) => {
        const flagged = answer.includes(i)
        return (
          <button
            key={i}
            type="button"
            className={`tile ${flagged ? 'tile-flagged' : ''}`}
            aria-pressed={flagged}
            disabled={disabled}
            onClick={() => onChange(flagged ? answer.filter((a) => a !== i) : [...answer, i])}
          >
            {word}
          </button>
        )
      })}
    </div>
  )
}
