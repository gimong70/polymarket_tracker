import Hero from './components/Hero'
import Features from './components/Features'
import VideoGrid from './components/VideoGrid'
import Contact from './components/Contact'

function App() {
  return (
    <div className="min-h-screen">
      {/* Navigation - Minimal and Futuristic */}
      <nav className="fixed top-0 left-0 w-full z-50 py-6 px-10 flex justify-between items-center backdrop-blur-md bg-black/10 border-b border-white/5">
        <div className="font-tech text-xl font-bold tracking-tighter">
          2nd<span className="text-cyan-400">N</span>Life
        </div>
        <div className="hidden md:flex gap-10 text-xs font-tech tracking-widest text-dim">
          <a href="#" className="hover:text-cyan-400 transition-colors">HOME</a>
          <a href="#analysis" className="hover:text-cyan-400 transition-colors">ANALYSIS</a>
          <a href="https://www.youtube.com/@2ndNLife/community" target="_blank" className="hover:text-cyan-400 transition-colors">COMMUNITY</a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">CONTACT</a>
        </div>
      </nav>

      <main>
        <Hero />
        <Features />
        <VideoGrid />
        <Contact />
      </main>
    </div>
  )
}

export default App
