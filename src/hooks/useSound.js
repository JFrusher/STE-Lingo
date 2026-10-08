import { useCallback } from 'react'
import { useGameStore } from '../store/useGameStore.js'

// Tones are synthesized with the Web Audio API, so there are no audio files to ship.
// Each note: [frequency in Hz, start offset in seconds].
const SOUNDS = {
  correct: { wave: 'sine', notes: [[523, 0], [784, 0.1]] },
  wrong: { wave: 'square', notes: [[220, 0], [165, 0.12]] },
  complete: { wave: 'sine', notes: [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.3]] },
}

// One shared context: browsers limit how many can be open.
let context = null

// Stable callback: reads the setting at play time, so toggling sound never re-runs effects that play.
export function useSound() {
  return useCallback(
    (name) => {
      if (!useGameStore.getState().soundOn) return
      context ??= new AudioContext()
      const { wave, notes } = SOUNDS[name]
      for (const [frequency, offset] of notes) {
        const start = context.currentTime + offset
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.type = wave
        oscillator.frequency.value = frequency
        gain.gain.setValueAtTime(0.12, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25)
        oscillator.connect(gain).connect(context.destination)
        oscillator.start(start)
        oscillator.stop(start + 0.25)
      }
    },
    [],
  )
}
