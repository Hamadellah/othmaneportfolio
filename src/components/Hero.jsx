import { Component, lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { CV_URL, CV_FILENAME } from "../theme";
import { SITE } from "../data/site";
import { useTypingEffect } from "../hooks";
import { GlowOrb, TechLogo, Icon } from "./common";
import WebGLFallback, { hasWebGL } from "./3d/WebGLFallback";
import { pickParticleCount } from "../utils/device";
import { loadProgress } from "../utils/loadProgress";
import { scrollToSection } from "../utils/scroll";

// The whole 3D stack (three, R3F, drei, shaders) lives in this lazy chunk, so the
// text of the page is interactive long before any WebGL code is downloaded.
const Scene = lazy(() => import("./3d/Scene"));

class PortraitBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.error("[portrait] falling back to the static image:", err);
    this.props.onFail?.();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const TITLES = ["Full-Stack Web Developer", "PHP/Laravel Developer", "React Developer", "REST API Developer", "Laravel & React Developer"];

/**
 * Hero. Layout (desktop: copy left / head right, phones: head first, then copy)
 * is done in CSS (styles/hero.css) so it needs no JavaScript and never flashes.
 * `entered` plays the entrance transitions; the prerendered HTML renders it already on.
 */
export default function HeroSection({ entered, onReady }) {
  const typed = useTypingEffect(TITLES);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [webgl, setWebgl] = useState(null); // null = not checked yet (also during prerender)
  const [mountScene, setMountScene] = useState(false);
  const count = useMemo(() => (typeof window === "undefined" ? 0 : pickParticleCount()), []);
  const reducedMotion = useMemo(
    () => (typeof window === "undefined" ? false : window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false),
    []
  );

  // Decide between the particle scene and the static fallback.
  useEffect(() => {
    const ok = hasWebGL();
    setWebgl(ok);
    if (!ok) {
      onReady?.();
      return;
    }
    // Eased progress while the 3D chunk downloads (real byte progress takes over after).
    let p = 2;
    const id = setInterval(() => {
      p += (17 - p) * 0.08;
      loadProgress.set(p, "Loading 3D engine");
    }, 120);
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1));
    idle(() => setMountScene(true));
    return () => clearInterval(id);
  }, [onReady]);

  // Pause the render loop while the hero is off-screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fallback = <WebGLFallback />;
  const scrollTo = (id) => scrollToSection(id);

  return (
    <section ref={sectionRef} id="home" className="hero" data-entered={entered ? "true" : "false"} aria-labelledby="hero-title">
      <GlowOrb x="-6%" y="8%" color="#00f5ff" size={460} />
      <GlowOrb x="58%" y="30%" color="#b855ff" size={380} />

      <div className="hero__inner">
        {/* ---- copy ------------------------------------------------------- */}
        <div className="hero__copy">
          <p className="hero__badge hero__item" style={{ "--i": 0 }}>
            <span className="hero__dot" /> Available for opportunities
          </p>

          <p className="hero__hi hero__item" style={{ "--i": 1 }}>Hi, I'm</p>
          <h1 id="hero-title" className="hero__name hero__item" style={{ "--i": 2 }}>
            <span className="hero__name-grad">Othmane</span> Hamadellah
            <span className="sr-only"> — Full-Stack Web Developer (PHP/Laravel &amp; React), Beni Mellal, Morocco</span>
          </h1>

          <p className="hero__role hero__item" style={{ "--i": 3 }}>
            <span className="hero__role-lead">I'm a </span>
            <span className="hero__role-typed">{typed}</span>
            <span className="hero__caret" aria-hidden="true">|</span>
          </p>

          <div className="hero__cta hero__item" style={{ "--i": 4 }}>
            <a className="btn btn--primary" href="#projects" onClick={(e) => { e.preventDefault(); scrollTo("projects"); }}>View Projects →</a>
            <a className="btn btn--ghost" href={`mailto:${SITE.email}`}>Get In Touch</a>
            <a className="btn btn--soft" href={CV_URL} download={CV_FILENAME}><Icon name="download" size={16} />Download CV</a>
          </div>

          <ul className="hero__social hero__item" style={{ "--i": 5 }} aria-label="Social profiles">
            <li><a href={SITE.linkedin} target="_blank" rel="me noopener noreferrer"><TechLogo name="linkedin" size={16} alt="" /> LinkedIn</a></li>
            <li><a href={SITE.github} target="_blank" rel="me noopener noreferrer"><TechLogo name="github" size={16} alt="" /> GitHub</a></li>
            <li><a href={`mailto:${SITE.email}`}><TechLogo name="gmail" size={16} alt="" /> Email</a></li>
          </ul>

          <p className="hero__intro hero__item" style={{ "--i": 6 }}>
            Full-Stack Web Developer specialized in PHP/Laravel and React, building secure REST APIs and MySQL-backed applications with Docker — backed by a Digital Infrastructure, Systems &amp; Networks foundation.
          </p>

          <dl className="hero__stats hero__item" style={{ "--i": 7 }}>
            {[["4", "Featured Projects"], ["2", "CCNA Certs"], ["FR/EN/AR", "Languages"]].map(([n, l]) => (
              <div key={l}>
                <dt>{n}</dt>
                <dd>{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---- the head: a stage of its own ------------------------------- */}
        <div className="hero__stage" aria-hidden="true">
          <div className="hero__halo" />
          {webgl === true && mountScene ? (
            <PortraitBoundary fallback={fallback} onFail={onReady}>
              <Suspense fallback={null}>
                <Scene count={count} play={entered} active={visible} reducedMotion={reducedMotion} onReady={onReady} />
              </Suspense>
            </PortraitBoundary>
          ) : webgl === true ? null : (
            fallback
          )}
          {webgl === true && <p className="hero__hint">Move your cursor · the head follows</p>}
        </div>
      </div>
    </section>
  );
}
