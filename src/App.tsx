import { useEffect } from 'react';
import Lenis from 'lenis';
import CinematicHero from './components/CinematicHero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import CursorGlow from './components/CursorGlow';
import GlobalAmbient from './components/GlobalAmbient';
import Interstitial from './components/Interstitial';

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <main className="relative grain">
      <CursorGlow />
      <GlobalAmbient />

      <div className="relative z-10">
        <CinematicHero />

        <Interstitial
          from="00"
          to="01"
          toLabel="PROLOGUE"
          quote="你好！我是小修。"
        />

        <About />

        <Interstitial
          from="01"
          to="02"
          toLabel="CRAFT"
          quote="接下来，是工具箱。"
        />

        <Skills />

        <Interstitial
          from="02"
          to="03"
          toLabel="CHRONICLE"
          quote="接下来，是做过的事。"
        />

        <Experience />

        <Interstitial
          from="03"
          to="04"
          toLabel="SELECTED WORKS"
          quote="接下来，是做过的东西。"
        />

        <Projects />

        <Interstitial
          from="04"
          to="05"
          toLabel="GALLERY"
          quote="接下来，是一些画面。"
        />

        <Gallery />

        <Interstitial
          from="05"
          to="06"
          toLabel="EPILOGUE"
          quote="让我们，聊点什么。"
        />

        <Contact />
      </div>
    </main>
  );
}
