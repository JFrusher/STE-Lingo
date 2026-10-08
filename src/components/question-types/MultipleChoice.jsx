export default function MultipleChoice({ question, answer, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-3">
      {question.options.map((option, i) => (
        <button
          key={i}
          type="button"
          className={`tile min-h-14 text-left ${answer === i ? 'tile-selected' : ''}`}
          aria-pressed={answer === i}
          disabled={disabled}
          onClick={() => onChange(i)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
