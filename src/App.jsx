import { useCallback, useEffect, useState } from "react";
import { NAV_ITEMS } from "./theme";
import { useScrollSpy } from "./hooks";
import AmbientBackground from "./components/AmbientBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import WhatIBuild from "./components/WhatIBuild";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Loader from "./components/3d/Loader";

/**
 * `prerender` is true only when the page is rendered to static HTML at build time
 * (scripts/prerender.mjs): no loader, hero already "entered". In the browser the
 * same markup is replaced by the live app.
 */
const SPY_IDS = NAV_ITEMS.map((n) => n.toLowerCase());

export default function App({ prerender = false }) {
  const [portraitReady, setPortraitReady] = useState(prerender);
  const [loaderDone, setLoaderDone] = useState(prerender);
  const [active, setActive] = useScrollSpy(SPY_IDS);

  const onPortraitReady = useCallback(() => setPortraitReady(true), []);
  const onLoaderDone = useCallback(() => setLoaderDone(true), []);

  // Safety net: never trap the visitor behind the loader.
  useEffect(() => {
    const t = setTimeout(() => setPortraitReady(true), 25000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ background: "transparent", minHeight: "100vh", color: "#fff", position: "relative", overflowX: "hidden" }}>
      <AmbientBackground />
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar active={active} onNavigate={setActive} entered={loaderDone} />
      <main id="main">
        <Hero entered={loaderDone} onReady={onPortraitReady} />
        <About />
        <WhatIBuild />
        <Skills />
        <Projects />
        <Experience />
        <Services />
        <Contact />
      </main>
      <Footer />
      {!loaderDone && <Loader ready={portraitReady} onDone={onLoaderDone} />}
    </div>
  );
}
