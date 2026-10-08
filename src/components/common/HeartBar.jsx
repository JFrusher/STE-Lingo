import { useAnimate } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/useGameStore.js'

export default function HeartBar() {
  const hearts = useGameStore((s) => s.hearts)
  const [scope, animate] = useAnimate()
  const previous = useRef(hearts)

  // Shake only when a heart is lost, not on refill or first render.
  useEffect(() => {
    if (hearts < previous.current) animate(scope.current, { x: [0, -8, 8, -6, 6, 0] }, { duration: 0.4 })
    previous.current = hearts
  }, [hearts, animate, scope])

  return (
    <div ref={scope} className="flex items-center gap-1 font-bold text-danger">
      <Heart className="h-6 w-6" fill="currentColor" aria-hidden="true" />
      <span>
        {hearts}
        <span className="sr-only"> hearts</span>
      </span>
    </div>
  )
}
