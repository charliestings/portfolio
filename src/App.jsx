import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SectionDivider3D from './components/SectionDivider3D'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <SectionDivider3D />
        <Projects />
        <SectionDivider3D />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
