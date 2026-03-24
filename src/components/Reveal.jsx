import useInView from '../hooks/useInView'
import styles from './Reveal.module.css'

/**
 * Wraps children in a scroll-reveal animation.
 * direction: 'up' | 'left' | 'right' | 'none'
 * delay: CSS delay string e.g. '0.2s'
 */
export default function Reveal({ children, direction = 'up', delay = '0s', className = '' }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${styles[direction]} ${inView ? styles.visible : ''} ${className}`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </div>
  )
}
