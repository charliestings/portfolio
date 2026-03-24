import { useRef, useState, useEffect } from 'react'
import { FiCode, FiLayout, FiServer, FiSmartphone } from 'react-icons/fi'
import Reveal from './Reveal'
import AboutOrb from './AboutOrb'
import styles from './About.module.css'

const skills = [
  { name: 'React / Next.js',          level: 92, colorA: '#f59e0b', colorB: '#fbbf24' },
  { name: 'JavaScript / TypeScript',  level: 88, colorA: '#ea580c', colorB: '#f97316' },
  { name: 'Node.js / Express',        level: 80, colorA: '#d97706', colorB: '#fbbf24' },
  { name: 'Python / FastAPI',         level: 75, colorA: '#ea580c', colorB: '#fbbf24' },
  { name: 'UI/UX & CSS',              level: 87, colorA: '#f59e0b', colorB: '#ea580c' },
  { name: 'PostgreSQL / MongoDB',     level: 72, colorA: '#92650a', colorB: '#f59e0b' },
]

const services = [
  { icon: <FiLayout />,     title: 'Frontend Dev',  desc: 'Pixel-perfect UIs' },
  { icon: <FiServer />,     title: 'Backend Dev',   desc: 'Scalable APIs' },
  { icon: <FiCode />,       title: 'Full Stack',    desc: 'End-to-end builds' },
  { icon: <FiSmartphone />, title: 'Responsive',    desc: 'Mobile-first' },
]

function SkillBar({ name, level, colorA, colorB, animate, index }) {
  return (
    <div className={styles.skillItem} style={{ transitionDelay: `${index * 0.09}s` }}>
      <div className={styles.skillHeader}>
        <span className={styles.skillName}>{name}</span>
        <span className={styles.skillLevel}>{level}%</span>
      </div>
      <div className={styles.skillTrack}>
        <div
          className={styles.skillFill}
          style={{
            width: animate ? `${level}%` : '0%',
            background: `linear-gradient(90deg, ${colorA}, ${colorB})`,
            transitionDelay: `${0.2 + index * 0.09}s`,
          }}
        />
      </div>
    </div>
  )
}

export default function About() {
  const [animate, setAnimate] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setAnimate(true) },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="about" className={`section ${styles.about}`} ref={ref}>
      <div className="container">
        <div className={styles.grid}>

          <div className={styles.left}>
            <Reveal direction="left">
              <p className="eyebrow">Who I am</p>
              <h2 className="section-title">
                Engineer by craft,<br />
                <span className="gradient-text">Visionary</span> by nature
              </h2>
            </Reveal>
            <Reveal direction="left" delay="0.12s">
              <p className={styles.bio}>
                I'm <strong style={{ color: 'var(--gold-light)' }}>Sudharsanan</strong> — a full-stack developer
                with 3+ years of experience designing and building premium web products. I believe
                great software is as much about feel as it is about function.
              </p>
            </Reveal>
            <Reveal direction="left" delay="0.22s">
              <p className={styles.bio}>
                From fintech dashboards to SaaS platforms, I help teams ship high-quality products
                that users love — on time, at scale, and with intention.
              </p>
            </Reveal>
            <Reveal direction="left" delay="0.34s">
              <div className={styles.services}>
                {services.map((s, i) => (
                  <div key={s.title} className={`glass-card ${styles.serviceCard}`} style={{ transitionDelay: `${i * 0.07}s` }}>
                    <div className={styles.serviceIcon}>{s.icon}</div>
                    <div>
                      <p className={styles.serviceTitle}>{s.title}</p>
                      <p className={styles.serviceDesc}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className={styles.right}>
            <Reveal direction="right">
              <p className="eyebrow">My toolkit</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AboutOrb />
                <h3 className={styles.skillsHeading}>Skills & Technologies</h3>
              </div>
            </Reveal>
            <Reveal direction="right" delay="0.12s">
              <div className={styles.skills}>
                {skills.map((s, i) => (
                  <SkillBar key={s.name} {...s} index={i} animate={animate} />
                ))}
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  )
}
