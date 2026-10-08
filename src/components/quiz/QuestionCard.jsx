import { motion } from 'framer-motion'
import MultipleChoice from '../question-types/MultipleChoice.jsx'
import SynonymSpotter from '../question-types/SynonymSpotter.jsx'
import WordBank from '../question-types/WordBank.jsx'
import WordLimit from '../question-types/WordLimit.jsx'

const inputs = {
  multiple_choice: MultipleChoice,
  word_bank: WordBank,
  synonym_spotter: SynonymSpotter,
  word_limit: WordLimit,
}

export default function QuestionCard({ question, answer, onChange, feedback }) {
  const Input = inputs[question.type]
  return (
    <motion.section
      className="card"
      animate={feedback?.correct === false ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="mb-6 text-xl font-bold text-gray-800 sm:text-2xl">{question.prompt}</h2>
      <Input question={question} answer={answer} onChange={onChange} disabled={feedback !== null} />
    </motion.section>
  )
}
