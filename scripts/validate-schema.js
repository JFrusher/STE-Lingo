import { readdirSync, readFileSync } from 'node:fs'
import { z } from 'zod'
import { lessonSchema } from '../src/types/lesson.js'

const dir = new URL('../src/data/lessons/', import.meta.url)
const files = readdirSync(dir).filter((file) => file.endsWith('.json'))
if (files.length === 0) {
  console.error('No lesson files found in src/data/lessons/')
  process.exit(1)
}

const unitIds = new Set()
let failed = false

for (const file of files) {
  try {
    const lesson = lessonSchema.parse(JSON.parse(readFileSync(new URL(file, dir), 'utf8')))
    // The app orders units by file name, so the name must start with the unitId.
    if (!file.startsWith(`${lesson.unitId}-`)) throw new Error(`File name must start with "${lesson.unitId}-"`)
    if (unitIds.has(lesson.unitId)) throw new Error(`Duplicate unitId "${lesson.unitId}"`)
    unitIds.add(lesson.unitId)
    console.log(`✓ ${file} (${lesson.questions.length} questions)`)
  } catch (error) {
    failed = true
    console.error(`✗ ${file}\n${error instanceof z.ZodError ? z.prettifyError(error) : error.message}`)
  }
}

process.exit(failed ? 1 : 0)
