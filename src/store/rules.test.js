import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import { correctAnswerText, countWords, currentStreak, isCorrect, nextStreak, wordLimitProblems } from './rules.js'

const dir = new URL('../data/lessons/', import.meta.url)
const lessons = readdirSync(dir).map((file) => JSON.parse(readFileSync(new URL(file, dir), 'utf8')))

// The key each lesson declares must grade as correct, or the question can never be passed.
function keyAnswer(question) {
  switch (question.type) {
    case 'multiple_choice':
      return question.correctIndex
    case 'word_bank': {
      const used = new Set()
      return question.correctAnswer.map((token) => {
        const i = question.tokens.findIndex((t, at) => t === token && !used.has(at))
        used.add(i)
        return i
      })
    }
    case 'synonym_spotter':
      return [...question.unapprovedIndices].reverse()
  }
}

test('every lesson answer key grades as correct', () => {
  for (const lesson of lessons) {
    for (const question of lesson.questions) {
      if (question.type === 'word_limit') {
        assert.equal(isCorrect(question, question.initialText), false, `${lesson.unitId}/${question.id} starts correct`)
        continue
      }
      assert.ok(isCorrect(question, keyAnswer(question)), `${lesson.unitId}/${question.id}`)
      assert.ok(correctAnswerText(question))
    }
  }
})

test('word_limit model answers pass, bad edits fail', () => {
  const byId = (unitId, id) => lessons.find((l) => l.unitId === unitId).questions.find((q) => q.id === id)
  const models = {
    'unit-01/q7': 'Before you start the procedure, put on the safety gloves.',
    'unit-02/q6': 'Release the hydraulic pressure before you disconnect the hydraulic lines from the actuator.',
    'unit-03/q6': 'Examine the spring of the pressure relief valve for corrosion before you install it.',
  }
  for (const [key, text] of Object.entries(models)) {
    const [unitId, id] = key.split('/')
    assert.ok(isCorrect(byId(unitId, id), text), key)
  }
  const q = byId('unit-01', 'q7')
  assert.equal(isCorrect(q, 'Put on the gloves.'), false, 'missing keyword')
  assert.equal(isCorrect(q, 'Beforehand put on the gloveset.'), false, 'keyword must be a whole word')
  assert.equal(isCorrect(q, 'Before you start, utilize the gloves.'), false, 'unapproved word')
  assert.deepEqual(wordLimitProblems(q, 'Prior to the start, you must utilize gloves and ensure they fit.'), [
    'Missing: before.',
    'Not STE-approved: utilize, ensure, prior to.',
  ])
  assert.deepEqual(wordLimitProblems(q, q.initialText).slice(0, 1), ['30 words. The maximum is 20.'])
})

test('synonym_spotter needs the exact set of words', () => {
  const q = { type: 'synonym_spotter', unapprovedIndices: [0, 1] }
  assert.equal(isCorrect(q, [0]), false)
  assert.equal(isCorrect(q, [0, 1, 2]), false)
  assert.equal(isCorrect(q, [1, 0]), true)
})

test('countWords ignores extra spaces', () => {
  assert.equal(countWords('  Push   the button. '), 3)
  assert.equal(countWords(''), 0)
})

test('streak grows on consecutive days and resets after a gap', () => {
  assert.equal(nextStreak(0, null, '2026-03-01'), 1)
  assert.equal(nextStreak(3, '2026-03-01', '2026-03-01'), 3)
  assert.equal(nextStreak(3, '2026-02-28', '2026-03-01'), 4)
  assert.equal(nextStreak(3, '2026-02-26', '2026-03-01'), 1)
  assert.equal(currentStreak(3, '2026-02-28', '2026-03-01'), 3)
  assert.equal(currentStreak(3, '2026-02-27', '2026-03-01'), 0)
})
