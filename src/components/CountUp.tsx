'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  /** Cílové číslo, ke kterému se má animace dopočítat */
  target: number
  /** Délka animace v ms */
  duration?: number
  /** Třídy pro <span> wrapper */
  className?: string
  /** Počet desetinných míst (default 0) */
  decimals?: number
}

/**
 * Animovaně počítá od 0 k `target` při scroll do view (IntersectionObserver).
 * Pure CSS + requestAnimationFrame, žádná dependency.
 *
 * Easing: easeOutCubic — rychlý start, plynulé doložení k cíli.
 * Spustí se jen jednou (po prvním viewport entry), respektuje prefers-reduced-motion.
 */
export default function CountUp({ target, duration = 1200, className, decimals = 0 }: CountUpProps) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // A11y: respektuj reduced motion — rovnou ukaž cílovou hodnotu
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setValue(target)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry.isIntersecting || startedRef.current) return
        startedRef.current = true

        const startTime = performance.now()
        const animate = (now: number) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          // easeOutCubic
          const eased = 1 - Math.pow(1 - progress, 3)
          setValue(target * eased)
          if (progress < 1) requestAnimationFrame(animate)
          else setValue(target)
        }
        requestAnimationFrame(animate)
        observer.disconnect()
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref} className={className}>
      {value.toFixed(decimals)}
    </span>
  )
}
