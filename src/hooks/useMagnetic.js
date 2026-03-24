import { useEffect, useRef, useCallback } from 'react'

/**
 * Magnetic hover effect: element smoothly pulls toward the cursor.
 * Returns a ref to attach to the target element.
 *
 * @param {number} strength - pull strength (default 0.35)
 * @param {number} ease     - lerp ease factor (default 0.15)
 */
export default function useMagnetic(strength = 0.35, ease = 0.15) {
  const ref = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const raf = useRef(null)
  const active = useRef(false)

  const lerp = (a, b, t) => a + (b - a) * t

  const animate = useCallback(() => {
    pos.current.x = lerp(pos.current.x, target.current.x, ease)
    pos.current.y = lerp(pos.current.y, target.current.y, ease)

    if (ref.current) {
      ref.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`
    }

    // Stop rafting once close enough and inactive
    if (
      !active.current &&
      Math.abs(pos.current.x) < 0.1 &&
      Math.abs(pos.current.y) < 0.1
    ) {
      if (ref.current) ref.current.style.transform = ''
      return
    }
    raf.current = requestAnimationFrame(animate)
  }, [ease])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Disable on touch devices
    if ('ontouchstart' in window) return

    const onEnter = () => {
      active.current = true
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(animate)
    }

    const onMove = (e) => {
      if (!active.current) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      target.current.x = (e.clientX - cx) * strength
      target.current.y = (e.clientY - cy) * strength
    }

    const onLeave = () => {
      active.current = false
      target.current.x = 0
      target.current.y = 0
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(animate)
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf.current)
    }
  }, [strength, animate])

  return ref
}
