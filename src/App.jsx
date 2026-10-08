import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

// Phase 1 smoke screen: proves Tailwind theme, lucide, framer-motion and confetti all load.
export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <motion.div className="card w-full max-w-md text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <h1 className="mb-4 text-3xl font-extrabold text-primary">STE-Lingo</h1>
        <button className="btn inline-flex items-center gap-2 bg-primary" onClick={() => confetti()}>
          <Check aria-hidden="true" /> Check
        </button>
      </motion.div>
    </main>
  )
}
