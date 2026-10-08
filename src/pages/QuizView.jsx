import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import FeedbackModal from '../components/quiz/FeedbackModal.jsx'
import QuestionCard from '../components/quiz/QuestionCard.jsx'
import QuizHeader from '../components/quiz/QuizHeader.jsx'
import { getUnit } from '../data/index.js'
import { hasAnswer, initialAnswer } from '../store/rules.js'
import { useGameStore } from '../store/useGameStore.js'

export default function QuizView() {
  const quiz = useGameStore((s) => s.activeQuiz)
  const exitQuiz = useGameStore((s) => s.exitQuiz)
  const unit = getUnit(quiz.unitId)
  const question = unit.questions[quiz.index]
  const answered = quiz.index + (quiz.feedback ? 1 : 0)

  return (
    <div className="flex flex-col gap-6 overflow-x-clip pb-64">
      <QuizHeader progress={answered / unit.questions.length} onExit={exitQuiz} />
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <QuizStep question={question} feedback={quiz.feedback} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Keyed by question above, so the answer state resets for each question.
function QuizStep({ question, feedback }) {
  const submitAnswer = useGameStore((s) => s.submitAnswer)
  const nextQuestion = useGameStore((s) => s.nextQuestion)
  const [answer, setAnswer] = useState(() => initialAnswer(question))

  return (
    <>
      <QuestionCard question={question} answer={answer} onChange={setAnswer} feedback={feedback} />
      {feedback === null && (
        <div className="fixed inset-x-0 bottom-0 border-t-2 border-gray-200 bg-white">
          <div className="mx-auto flex max-w-2xl justify-end px-4 py-6">
            <button
              type="button"
              className="btn w-full bg-primary sm:w-auto"
              disabled={!hasAnswer(answer)}
              onClick={() => submitAnswer(answer)}
            >
              Check
            </button>
          </div>
        </div>
      )}
      <AnimatePresence>
        {feedback && <FeedbackModal correct={feedback.correct} question={question} onContinue={nextQuestion} />}
      </AnimatePresence>
    </>
  )
}
