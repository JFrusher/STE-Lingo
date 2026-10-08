import { motion } from 'framer-motion'

// value is 0..1
export default function ProgressBar({ value }) {
  return (
    <div
      className="h-4 w-full overflow-hidden rounded-full bg-gray-200"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
    >
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={false}
        animate={{ width: `${value * 100}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  )
}
