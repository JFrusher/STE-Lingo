// Pure game rules. No React, no storage, so Node can test them and the schema can reuse them.

export const MAX_HEARTS = 5
export const XP_PER_CORRECT = 10

export const sentenceWords = (sentence) => sentence.split(' ')

export const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length

// Lowercase words, no punctuation, padded with spaces so includes() matches whole words only.
const normalize = (text) => ` ${text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim().split(/\s+/).join(' ')} `

export function initialAnswer(question) {
  switch (question.type) {
    case 'multiple_choice':
      return null
    case 'word_bank':
    case 'synonym_spotter':
      return []
    case 'word_limit':
      return question.initialText
    default:
      throw new Error(`Unknown question type: ${question.type}`)
  }
}

export function hasAnswer(answer) {
  if (answer === null) return false
  if (typeof answer === 'string') return answer.trim() !== ''
  if (Array.isArray(answer)) return answer.length > 0
  return true
}

// answer shape: multiple_choice → option index, word_bank → token indices in order,
// synonym_spotter → word indices, word_limit → text.
export function isCorrect(question, answer) {
  switch (question.type) {
    case 'multiple_choice':
      return answer === question.correctIndex
    case 'word_bank':
      return answer.map((i) => question.tokens[i]).join(' ') === question.correctAnswer.join(' ')
    case 'synonym_spotter':
      return (
        answer.length === question.unapprovedIndices.length &&
        question.unapprovedIndices.every((i) => answer.includes(i))
      )
    case 'word_limit': {
      const text = normalize(answer)
      return (
        countWords(answer) <= question.maxWords &&
        question.acceptableKeywords.every((keyword) => text.includes(normalize(keyword)))
      )
    }
    default:
      throw new Error(`Unknown question type: ${question.type}`)
  }
}

export function correctAnswerText(question) {
  switch (question.type) {
    case 'multiple_choice':
      return question.options[question.correctIndex]
    case 'word_bank':
      return question.correctAnswer.join(' ')
    case 'synonym_spotter': {
      const words = sentenceWords(question.sentence)
      const flagged = question.unapprovedIndices.map((i) => words[i]).join(' ')
      return `"${flagged}" → ${question.approvedAlternative}`
    }
    case 'word_limit':
      return `${question.maxWords} words or fewer, using: ${question.acceptableKeywords.join(', ')}`
    default:
      throw new Error(`Unknown question type: ${question.type}`)
  }
}

// Days are local "YYYY-MM-DD" strings.
export const localDay = (date = new Date()) => date.toLocaleDateString('en-CA')

function dayBefore(day) {
  const date = new Date(`${day}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() - 1)
  return date.toISOString().slice(0, 10)
}

export function nextStreak(streak, lastActiveDate, today) {
  if (lastActiveDate === today) return streak
  return lastActiveDate === dayBefore(today) ? streak + 1 : 1
}

// A streak is only alive if the user played today or yesterday.
export function currentStreak(streak, lastActiveDate, today) {
  return lastActiveDate === today || lastActiveDate === dayBefore(today) ? streak : 0
}
