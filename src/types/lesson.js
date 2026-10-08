import { z } from 'zod'
import { countWords, sentenceWords } from '../store/rules.js'

const text = z.string().trim().min(1)
const index = z.number().int().nonnegative()
const base = { id: text, prompt: text, explanation: text }

// Every correctAnswer token must come from the pool, counting repeats.
function buildableFrom(answer, tokens) {
  const pool = [...tokens]
  for (const token of answer) {
    const at = pool.indexOf(token)
    if (at === -1) return false
    pool.splice(at, 1)
  }
  return true
}

const multipleChoice = z
  .object({ ...base, type: z.literal('multiple_choice'), options: z.array(text).min(2), correctIndex: index })
  .strict()
  .refine((q) => q.correctIndex < q.options.length, { message: 'correctIndex is out of range', path: ['correctIndex'] })

const wordBank = z
  .object({ ...base, type: z.literal('word_bank'), tokens: z.array(text).min(2), correctAnswer: z.array(text).min(1) })
  .strict()
  .refine((q) => buildableFrom(q.correctAnswer, q.tokens), {
    message: 'correctAnswer uses a token that is not in tokens',
    path: ['correctAnswer'],
  })

const synonymSpotter = z
  .object({
    ...base,
    type: z.literal('synonym_spotter'),
    sentence: text,
    unapprovedIndices: z.array(index).min(1),
    approvedAlternative: text,
  })
  .strict()
  .refine((q) => new Set(q.unapprovedIndices).size === q.unapprovedIndices.length, {
    message: 'unapprovedIndices has duplicates',
    path: ['unapprovedIndices'],
  })
  .refine((q) => q.unapprovedIndices.every((i) => i < sentenceWords(q.sentence).length), {
    message: 'unapprovedIndices points past the end of the sentence',
    path: ['unapprovedIndices'],
  })

const wordLimit = z
  .object({
    ...base,
    type: z.literal('word_limit'),
    initialText: text,
    maxWords: z.number().int().positive(),
    acceptableKeywords: z.array(text).min(1),
  })
  .strict()
  .refine((q) => countWords(q.initialText) > q.maxWords, {
    message: 'initialText must start over maxWords, or there is nothing to edit',
    path: ['initialText'],
  })

export const questionSchema = z.discriminatedUnion('type', [multipleChoice, wordBank, synonymSpotter, wordLimit])

export const lessonSchema = z
  .object({
    unitId: z.string().regex(/^unit-\d{2}$/, 'unitId must look like "unit-01"'),
    unitTitle: text,
    description: text,
    questions: z.array(questionSchema).min(1),
  })
  .strict()
  .refine((l) => new Set(l.questions.map((q) => q.id)).size === l.questions.length, {
    message: 'question ids must be unique',
    path: ['questions'],
  })
