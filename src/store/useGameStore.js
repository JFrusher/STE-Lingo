import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getUnit, units } from '../data/index.js'
import { MAX_HEARTS, XP_PER_CORRECT, isCorrect, localDay, nextStreak } from './rules.js'

const quizMatchesLessons = (quiz) =>
  units.some((u) => u.unitId === quiz.unitId && quiz.index < u.questions.length)

const freshProgress = {
  hearts: MAX_HEARTS,
  streak: 0,
  lastActiveDate: null,
  xp: 0,
  completedUnits: [],
  activeQuiz: null,
}

export const useGameStore = create()(
  persist(
    (set, get) => ({
      ...freshProgress,
      soundOn: true,

      startQuiz: (unitId) =>
        set({
          activeQuiz: { unitId, index: 0, correctCount: 0, wrongIds: [], feedback: null, finished: false, passed: false },
        }),

      submitAnswer: (answer) => {
        const { activeQuiz: quiz, hearts, xp } = get()
        const question = getUnit(quiz.unitId).questions[quiz.index]
        const correct = isCorrect(question, answer)
        set({
          hearts: correct ? hearts : hearts - 1,
          xp: correct ? xp + XP_PER_CORRECT : xp,
          activeQuiz: {
            ...quiz,
            correctCount: correct ? quiz.correctCount + 1 : quiz.correctCount,
            wrongIds: correct ? quiz.wrongIds : [...quiz.wrongIds, question.id],
            feedback: { correct, answer },
          },
        })
        return correct
      },

      nextQuestion: () => {
        const { activeQuiz: quiz, hearts } = get()
        const isLast = quiz.index + 1 === getUnit(quiz.unitId).questions.length
        if (hearts > 0 && !isLast) {
          set({ activeQuiz: { ...quiz, index: quiz.index + 1, feedback: null } })
          return
        }
        const passed = hearts > 0
        set({ activeQuiz: { ...quiz, feedback: null, finished: true, passed } })
        if (passed) get().completeUnit(quiz.unitId)
      },

      completeUnit: (unitId) => {
        const { completedUnits, streak, lastActiveDate } = get()
        const today = localDay()
        set({
          completedUnits: completedUnits.includes(unitId) ? completedUnits : [...completedUnits, unitId],
          streak: nextStreak(streak, lastActiveDate, today),
          lastActiveDate: today,
        })
      },

      resetHearts: () => set({ hearts: MAX_HEARTS }),

      exitQuiz: () => set({ activeQuiz: null }),

      // Keeps the sound setting: it is a preference, not progress.
      resetProgress: () => set(freshProgress),

      toggleSound: () => set({ soundOn: !get().soundOn }),
    }),
    {
      name: 'ste-lingo',
      // Lessons change in Git between visits; drop a saved quiz that no longer fits the current lessons.
      merge: (persisted, current) => {
        const quiz = persisted?.activeQuiz
        return { ...current, ...persisted, activeQuiz: quiz && quizMatchesLessons(quiz) ? quiz : null }
      },
    },
  ),
)
