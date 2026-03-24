import { useRef, useCallback } from 'react'
import { FiGithub, FiExternalLink, FiStar } from 'react-icons/fi'
import Reveal from './Reveal'
import ProjectsCrystal from './ProjectsCrystal'
import styles from './Projects.module.css'

const projects = [
{
  title: 'Bharath CRM',
  description: 'Full-stack CRM platform for managing invoices, proposals, and dashboards with secure authentication, real-time data handling, and responsive UI built for business workflows.',
  tags: ['React', 'Spring Boot', 'PostgreSQL', 'Redux', 'Tailwind CSS'],
  github: 'https://github.com/charliestings/projectcrm.git',
  live: 'https://projectcrm-rho.vercel.app/',
  colorA: '#2563eb',
  colorB: '#1e3a8a',
  emoji: '📊',
  stars: 78,
  featured: true,
},
{
  title: 'PeerLend',
  description: 'Secure peer-to-peer lending platform enabling user onboarding, loan requests, approvals, and transaction tracking with robust authentication and real-time UI updates.',
  tags: ['React', 'Spring Boot', 'PostgreSQL', 'Redux', 'Spring Security'],
  github: 'https://github.com/charliestings/peerlend',
  live: 'https://cyberlend.vercel.app/',
  colorA: '#16a34a',
  colorB: '#14532d',
  emoji: '💰',
  stars: 92,
  featured: true,
},

]

function ProjectCard({ p }) {
  const cardRef = useRef(null)
  const flareRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = ((y - cy) / cy) * -8
    const rotateY = ((x - cx) / cx) * 8

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`

    if (flareRef.current) {
      flareRef.current.style.left = `${x}px`
      flareRef.current.style.top = `${y}px`
      flareRef.current.style.opacity = '1'
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (card) card.style.transform = ''
    if (flareRef.current) flareRef.current.style.opacity = '0'
  }, [])

  return (
    <article
      ref={cardRef}
      className={`${styles.card} ${p.featured ? styles.featured : ''}`}
      style={{ '--ca': p.colorA, '--cb': p.colorB }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cursor light flare */}
      <div ref={flareRef} className={styles.flare} />

      <div className={styles.banner}>
        <div className={styles.bannerGlow} />
        <span className={styles.emoji}>{p.emoji}</span>
        <div className={styles.bannerMeta}>
          {p.featured && <span className={styles.featuredBadge}>Featured</span>}
          <span className={styles.stars}><FiStar />{p.stars}</span>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.row}>
          <h3 className={styles.title}>{p.title}</h3>
          <div className={styles.links}>
            <a href={p.github} target="_blank" rel="noreferrer" className={styles.iconLink}><FiGithub /></a>
            <a href={p.live}   target="_blank" rel="noreferrer" className={styles.iconLink}><FiExternalLink /></a>
          </div>
        </div>
        <p className={styles.desc}>{p.description}</p>
        <div className={styles.tags}>
          {p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>
      </div>
      <div className={styles.sweepLine} />
    </article>
  )
}

export default function Projects() {
  return (
    <section id="projects" className={`section ${styles.projects}`} style={{ position: 'relative', overflow: 'hidden' }}>
      <ProjectsCrystal />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <Reveal>
          <p className="eyebrow">What I've built</p>
          <h2 className="section-title">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle">
            A curated selection — each built with purpose, performance, and polish.
          </p>
        </Reveal>

        <div className={styles.grid}>
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={`${i * 0.1}s`} direction={i % 2 === 0 ? 'left' : 'right'}>
              <ProjectCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
