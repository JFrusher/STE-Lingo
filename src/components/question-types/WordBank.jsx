import { motion } from 'framer-motion'

// answer is the list of token indices in the order the user tapped them.
export default function WordBank({ question, answer, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-8">
      <div
        className="flex min-h-24 flex-wrap content-start gap-2 border-b-2 border-gray-200 pb-4"
        aria-label="Your sentence"
      >
        {answer.map((tokenIndex) => (
          <motion.button
            key={tokenIndex}
            layoutId={`token-${tokenIndex}`}
            type="button"
            className="tile"
            disabled={disabled}
            onClick={() => onChange(answer.filter((i) => i !== tokenIndex))}
          >
            {question.tokens[tokenIndex]}
          </motion.button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2" aria-label="Word bank">
        {question.tokens.map((token, i) =>
          answer.includes(i) ? (
            // Keep the empty slot so the bank does not jump around.
            <span key={i} className="tile invisible" aria-hidden="true">
              {token}
            </span>
          ) : (
            <motion.button
              key={i}
              layoutId={`token-${i}`}
              type="button"
              className="tile"
              disabled={disabled}
              onClick={() => onChange([...answer, i])}
            >
              {token}
            </motion.button>
          ),
        )}
      </div>
    </div>
  )
}
