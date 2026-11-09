import { useState, useEffect, useRef } from "react";
import myImage from './othmane12.webp';
import bgPhoto from './othmane-photo.jpg';
import bgVideo from './othmane-bg.mp4';
import cvFile from './othmane-cv.pdf';
const COLORS = {
  cyan: "#00f5ff",
  purple: "#b855ff",
  blue: "#4f8ef7",
  dark: "#050510",
  darkCard: "#0a0a1a",
  darkBorder: "#1a1a35",
};

const NAV_ITEMS = ["Home","About","Skills","Projects","Experience","Services","Contact"];

function useTypingEffect(texts, speed = 80) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = texts[idx % texts.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), 1800);
        else setCharIdx(c => c + 1);
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) { setDeleting(false); setIdx(i => i + 1); setCharIdx(0); }
        else setCharIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, speed]);
  return display;
}

function useIsMobile() {
 
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

// Hook: returns true once element enters viewport
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// Wrapper: animates children into view with a chosen effect
function Reveal({ children, effect = "fadeUp", delay = 0, style = {} }) {
  const [ref, visible] = useReveal(0.1);
  const base = { transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`, willChange: "opacity, transform" };
  const hidden = {
    fadeUp:    { opacity: 0, transform: "translateY(48px)" },
    fadeLeft:  { opacity: 0, transform: "translateX(-60px)" },
    fadeRight: { opacity: 0, transform: "translateX(60px)" },
    fadeIn:    { opacity: 0, transform: "scale(0.94)" },
    slideUp:   { opacity: 0, transform: "translateY(80px) scale(0.97)" },
  }[effect] || { opacity: 0 };
  const shown = { opacity: 1, transform: "translateY(0) translateX(0) scale(1)" };
  return (
    <div ref={ref} style={{ ...base, ...(visible ? shown : hidden), ...style }}>
      {children}
    </div>
  );
}

// Stagger wrapper: each child gets an increasing delay
function RevealGroup({ children, effect = "fadeUp", stagger = 100, baseDelay = 0 }) {
  return (
    <>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <Reveal key={i} effect={effect} delay={baseDelay + i * stagger}>{child}</Reveal>
          ))
        : <Reveal effect={effect} delay={baseDelay}>{children}</Reveal>}
    </>
  );
}

// Glowing divider between sections
function SectionDivider({ color1 = "#00f5ff", color2 = "#b855ff" }) {
  const [ref, visible] = useReveal(0.5);
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2rem", overflow: "hidden" }}>
      <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${color1}44)`, transition: "opacity 1s ease", opacity: visible ? 1 : 0 }} />
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color1, margin: "0 12px", boxShadow: `0 0 12px ${color1}`, transition: "opacity 0.8s 0.3s ease, transform 0.8s 0.3s cubic-bezier(0.22,1,0.36,1)", opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0)" }} />
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: color2, margin: "0 8px", boxShadow: `0 0 10px ${color2}`, transition: "opacity 0.8s 0.45s ease, transform 0.8s 0.45s cubic-bezier(0.22,1,0.36,1)", opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0)" }} />
      <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#fff", margin: "0 8px", transition: "opacity 0.8s 0.55s ease, transform 0.8s 0.55s cubic-bezier(0.22,1,0.36,1)", opacity: visible ? 0.4 : 0, transform: visible ? "scale(1)" : "scale(0)" }} />
      <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color2}44, transparent)`, transition: "opacity 1s ease", opacity: visible ? 1 : 0 }} />
    </div>
  );
}

// Fixed, full-page photo backdrop: Othmane's real portrait, converted to a
// cyan/violet duotone so it reads as "coding-web" rather than a plain photo,
// with a slow Ken-Burns drift, a moving aurora wash, and a subtle mouse
// parallax on desktop. A dark gradient keeps every section readable on top.

function VideoBackground() {
  const isMobile = useIsMobile();
  const wrapRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isMobile) return;

    const wrap = wrapRef.current;
    const video = videoRef.current;

    if (!wrap || !video) return;

    let raf = null;

    const onMove = (e) => {
      if (raf) return;

      raf = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;

        // Mouvement léger باش مايبعدش الوجه بزاف
        video.style.setProperty("--px", `${nx * -3}px`);
        video.style.setProperty("--py", `${ny * -3}px`);

        raf = null;
      });
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);

      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, [isMobile]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -3,
        overflow: "hidden",
        background: "#050510",
      }}
    >
      {/* VIDEO BACKGROUND */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          src={bgVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",

            width: "100%",
            height: "100%",

            objectFit: "cover",

            // مركز الفيديو
            objectPosition: "center center",

            // Zoom متوسط
            transform:
              "translate(-50%, -50%) translate(var(--px, 0px), var(--py, 0px)) scale(0.92)",

            filter:
              "brightness(0.65) contrast(1.05) saturate(1.05)",

            transition: "transform 0.4s ease-out",
          }}
        />
      </div>

      {/* CYAN / PURPLE OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(0,245,255,0.12), rgba(5,5,16,0.15) 45%, rgba(184,85,255,0.12))",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* DARK OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,5,16,0.25) 0%, rgba(5,5,16,0.55) 50%, rgba(5,5,16,0.92) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* RADIAL VIGNETTE */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(5,5,16,0.25) 60%, rgba(5,5,16,0.8) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* SCANLINES */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 4px)",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />

      {/* CYAN GLOW */}
      <div
        style={{
          position: "absolute",
          width: "40vw",
          height: "40vw",
          top: "-10%",
          left: "-10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,245,255,0.15), transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
          animation: "aurora1 15s ease-in-out infinite",
        }}
      />

      {/* PURPLE GLOW */}
      <div
        style={{
          position: "absolute",
          width: "40vw",
          height: "40vw",
          bottom: "-10%",
          right: "-10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(184,85,255,0.15), transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          animation: "aurora2 18s ease-in-out infinite",
        }}
      />
    </div>
  );
}

// Matrix-style "code rain": columns of real snippets from Othmane's stack
// (PHP/Laravel/React/TCP-IP tokens) drifting down over the photo backdrop.
function CodeRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? 13 : 15;
    const glyphs = "01{}<>/;=+-*[]()$#PHPSQLREACTAPITCPIPGITLARAVEL".split("");

    let cols = 0;
    let drops = [];
    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / (fontSize * 1.4));
      drops = Array.from({ length: cols }, () => Math.random() * -canvas.height / fontSize);
    };
    setup();

    let animId;
    function draw() {
      ctx.fillStyle = "rgba(5,5,16,0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px 'Space Grotesk', monospace`;
      for (let i = 0; i < cols; i++) {
        const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * fontSize * 1.4;
        const y = drops[i] * fontSize;
        const isHead = Math.random() > 0.94;
        ctx.fillStyle = isHead ? "#ffffff" : (i % 2 === 0 ? "rgba(0,245,255,0.55)" : "rgba(184,85,255,0.5)");
        ctx.fillText(glyph, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.35;
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener("resize", setup);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", setup); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: -1, opacity: 0.35 }} />;
}

function GlowOrb({ x, y, color, size = 300 }) {
  return <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, filter: "blur(80px)", opacity: 0.1, pointerEvents: "none" }} />;
}

function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled || menuOpen ? "rgba(5,5,16,0.95)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(0,245,255,0.08)" : "none", transition: "all 0.3s ease" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, padding: "0 1.25rem" }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>OH.</span>
        {/* Desktop nav */}
        <div id="desktop-nav" style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {NAV_ITEMS.map(item => (
            <button key={item} onClick={() => scrollTo(item)} style={{ background: "none", border: "none", cursor: "pointer", color: active === item.toLowerCase() ? COLORS.cyan : "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 500, transition: "color 0.2s", borderBottom: active === item.toLowerCase() ? `2px solid ${COLORS.cyan}` : "2px solid transparent", paddingBottom: 2 }}>{item}</button>
          ))}
          <a href={cvFile} download="Othmane_Hamadellah_CV.pdf" style={{ background: "transparent", color: COLORS.cyan, border: `1px solid ${COLORS.cyan}`, padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: "'Space Grotesk', sans-serif", whiteSpace: "nowrap" }}>Download CV</a>
          <a href="mailto:hamadellahotman13@gmail.com" style={{ background: "linear-gradient(135deg, #00f5ff, #4f8ef7)", color: "#000", padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: "'Space Grotesk', sans-serif", whiteSpace: "nowrap" }}>Hire Me</a>
        </div>
        {/* Hamburger */}
        <button id="hamburger-btn" onClick={() => setMenuOpen(m => !m)} style={{ display: "none", background: "none", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 8, cursor: "pointer", color: "#fff", fontSize: 20, width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "rgba(5,5,16,0.98)", padding: "0.5rem 1.25rem 1.5rem", borderTop: "1px solid rgba(0,245,255,0.1)" }}>
          {NAV_ITEMS.map(item => (
            <button key={item} onClick={() => scrollTo(item)} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", color: active === item.toLowerCase() ? COLORS.cyan : "rgba(255,255,255,0.8)", fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, padding: "14px 0" }}>{item}</button>
          ))}
          <a href={cvFile} download="Othmane_Hamadellah_CV.pdf" style={{ display: "block", marginTop: "1rem", background: "transparent", color: COLORS.cyan, border: `1px solid ${COLORS.cyan}`, padding: "12px", borderRadius: 8, textAlign: "center", fontWeight: 700, textDecoration: "none", fontFamily: "'Space Grotesk', sans-serif" }}>Download CV</a>
          <a href="mailto:hamadellahotman13@gmail.com" style={{ display: "block", marginTop: "0.75rem", background: "linear-gradient(135deg, #00f5ff, #4f8ef7)", color: "#000", padding: "12px", borderRadius: 8, textAlign: "center", fontWeight: 700, textDecoration: "none", fontFamily: "'Space Grotesk', sans-serif" }}>Hire Me</a>
        </div>
      )}
    </nav>
  );
}

function GlassCard({ children, accentColor = COLORS.cyan, style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)", border: `1px solid ${hovered ? accentColor + "44" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: "1.25rem", transition: "all 0.3s ease", boxShadow: hovered ? `0 0 30px ${accentColor}22` : "none", transform: hovered ? "translateY(-4px)" : "translateY(0)", ...style }}>
      {children}
    </div>
  );
}

function SectionHeader({ tag, title, center = false }) {
  return (
    <Reveal effect="fadeUp" delay={0}>
    <div style={{ marginBottom: "3rem", textAlign: center ? "center" : "left" }}>
      <span style={{ color: COLORS.cyan, fontSize: 12, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>{tag}</span>
      <h2 style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0.5rem 0 0", fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
      <div style={{ width: 60, height: 3, background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.purple})`, borderRadius: 2, marginTop: "1rem", marginLeft: center ? "auto" : 0, marginRight: center ? "auto" : 0 }} />
    </div>
    </Reveal>
  );
}

function HeroSection() {
  const typed = useTypingEffect(["Full-Stack Web Developer", "PHP/Laravel Developer", "React Developer", "REST API Developer", "Laravel & React Developer"]);
  const isMobile = useIsMobile();
  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: isMobile ? "80px 1.25rem 3rem" : "0 2rem" }}>
      <GlowOrb x="-100px" y="10%" color={COLORS.cyan} size={isMobile ? 250 : 500} />
      <GlowOrb x="60%" y="20%" color={COLORS.purple} size={isMobile ? 200 : 400} />
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "3rem" : "4rem", alignItems: "center" }}>
        {/* Text side */}
        <div style={{ order: isMobile ? 2 : 1 }}>
          <Reveal effect="fadeLeft" delay={100}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 20, padding: "6px 14px", marginBottom: "1.25rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00ff88", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ color: COLORS.cyan, fontSize: 12, fontFamily: "'Space Grotesk', sans-serif" }}>Available for opportunities</span>
          </div>
          </Reveal>
          <Reveal effect="fadeLeft" delay={220}>
          <h1 style={{ fontSize: "clamp(2rem, 8vw, 4rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 1rem", fontFamily: "'Space Grotesk', sans-serif", color: "#fff" }}>
            Hi, I'm <span style={{ background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Othmane</span>
          </h1>
          </Reveal>
          <Reveal effect="fadeLeft" delay={340}>
          <div style={{ fontSize: "clamp(1rem, 4vw, 1.8rem)", fontWeight: 600, minHeight: 44, marginBottom: "1.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>I'm a </span>
            <span style={{ color: COLORS.cyan }}>{typed}</span>
            <span style={{ color: COLORS.cyan, animation: "blink 1s infinite" }}>|</span>
          </div>
          </Reveal>
          <Reveal effect="fadeLeft" delay={440}>
          <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: 480, marginBottom: "2rem", fontSize: 15, fontFamily: "'Space Grotesk', sans-serif" }}>
            Full-Stack Web Developer specialized in PHP/Laravel and React, building secure REST APIs and MySQL-backed applications with Docker — backed by a Digital Infrastructure, Systems & Networks foundation.
          </p>
          </Reveal>
          <Reveal effect="fadeUp" delay={560}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "linear-gradient(135deg, #00f5ff, #4f8ef7)", color: "#000", padding: "12px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14 }}>View Projects →</button>
            <a href="mailto:hamadellahotman13@gmail.com" style={{ background: "transparent", color: COLORS.cyan, padding: "12px 24px", borderRadius: 8, border: `1px solid ${COLORS.cyan}`, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, textDecoration: "none", display: "inline-block" }}>Get In Touch</a>
            <a href={cvFile} download="Othmane_Hamadellah_CV.pdf" style={{ background: "rgba(255,255,255,0.05)", color: "#fff", padding: "12px 24px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>📄 Download CV</a>
          </div>
          </Reveal>
          <Reveal effect="fadeUp" delay={700}>
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "2.5rem" }}>
            {[["4", "Featured Projects"], ["2", "CCNA Certs"], ["FR/EN/AR", "Languages"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 26, fontWeight: 800, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Space Grotesk', sans-serif" }}>{n}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif" }}>{l}</div>
              </div>
            ))}
          </div>
          </Reveal>
        </div>
        {/* Avatar side */}
        <div style={{ display: "flex", justifyContent: "center", order: isMobile ? 1 : 2 }}>
          <Reveal effect="fadeRight" delay={300}>
          <div style={{ position: "relative", width: isMobile ? 240 : 320, height: isMobile ? 240 : 320 }}>
            <div style={{ position: "absolute", inset: -3, borderRadius: "50%", background: "linear-gradient(135deg, #00f5ff, #b855ff, #4f8ef7)", animation: "spin 8s linear infinite" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: COLORS.dark, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(0,245,255,0.1), rgba(184,85,255,0.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 56 : 72 }}>
               <img
  src={myImage}
  alt="Othmane"
  className="w-[250px] h-[250px] md:w-[330px] md:h-[330px]"
/>
              </div>
            </div>
            {!isMobile && [{ top: "5%", right: "0%", label: "Laravel", icon: "⚡" }, { bottom: "10%", left: "-5%", label: "React", icon: "⚛️" }, { top: "40%", right: "-8%", label: "REST API", icon: "🔌" }].map(({ top, right, bottom, left, label, icon }) => (
              <div key={label} style={{ position: "absolute", top, right, bottom, left, background: "rgba(10,10,26,0.9)", border: "1px solid rgba(0,245,255,0.2)", backdropFilter: "blur(10px)", borderRadius: 12, padding: "7px 12px", display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{label}</span>
              </div>
            ))}
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const isMobile = useIsMobile();
  return (
    <>
    <SectionDivider color1="#00f5ff" color2="#4f8ef7" />
    <section id="about" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
      <GlowOrb x="70%" y="50%" color={COLORS.blue} size={300} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="01. About Me" title="Who I Am" />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "2rem" : "4rem", alignItems: "center" }}>
          <Reveal effect="fadeLeft" delay={100}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.9, fontSize: 15, marginBottom: "1.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>
              Full-Stack Web Developer specialized in PHP/Laravel and React, with a background in Digital Infrastructure, Systems and Networks. I build secure, scalable and user-focused web applications, from REST APIs and authentication to modern responsive interfaces.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.9, fontSize: 15, marginBottom: "1.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>
              Motivated and rigorous, I combine backend development, frontend integration and infrastructure knowledge to build complete digital solutions.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.75rem" }}>
              {[["📍", "Beni Mellal, Morocco"], ["📧", "hamadellahotman13@gmail.com"], ["📱", "+212 688082991"], ["🌐", "Arabic, French, English"]].map(([icon, text]) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif", wordBreak: "break-all" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[{ icon: "⚡", title: "Full-Stack Dev", desc: "PHP, Laravel, REST API on the back end; React, JavaScript on the front end", color: "#00ff88" },
              { icon: "🧩", title: "Frameworks", desc: "Laravel, React, Bootstrap, Tailwind CSS", color: "#b855ff" },
              { icon: "🌐", title: "Networking", desc: "CCNA certified: TCP/IP configuration, IP addressing & subnetting, routing", color: "#00f5ff" },
              { icon: "🖥️", title: "Systems", desc: "Windows Server, Linux administration, virtualization (VirtualBox / VMware)", color: "#4f8ef7" },
            ].map(({ icon, title, desc, color }, i) => (
              <Reveal key={title} effect="fadeIn" delay={150 + i * 100}>
              <GlassCard accentColor={color} style={{ padding: "1rem" }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
                <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.6, fontFamily: "'Space Grotesk', sans-serif" }}>{desc}</p>
              </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

const WHAT_I_BUILD = [
  { icon: "⚡", label: "Full-Stack Web Applications", color: "#00ff88" },
  { icon: "🔐", label: "Secure REST APIs & Authentication", color: "#00f5ff" },
  { icon: "📊", label: "Admin Dashboards", color: "#4f8ef7" },
  { icon: "🎟️", label: "Event & Reservation Systems", color: "#b855ff" },
  { icon: "🌐", label: "Responsive React Interfaces", color: "#ff4d8d" },
  { icon: "🐳", label: "Dockerized Applications", color: "#ffd700" },
];

function WhatIBuildSection() {
  const isMobile = useIsMobile();
  return (
    <>
    <SectionDivider color1="#00f5ff" color2="#b855ff" />
    <section id="what-i-build" style={{ padding: isMobile ? "60px 1.25rem" : "80px 2rem", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="What I Build" title="Building Blocks" center />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {WHAT_I_BUILD.map((item, i) => (
            <Reveal key={item.label} effect="fadeIn" delay={i * 80}>
              <GlassCard accentColor={item.color} style={{ textAlign: "center", padding: "1.25rem 1rem" }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.4 }}>{item.label}</div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

const SKILLS = [
  { cat: "Frontend", color: "#00ff88", icon: "🎨", items: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Bootstrap"] },
  { cat: "Backend", color: "#00f5ff", icon: "⚙️", items: ["PHP", "Laravel", "REST API", "MVC", "Authentication"] },
  { cat: "Database", color: "#4f8ef7", icon: "🗄️", items: ["MySQL", "SQLite", "Firebase"] },
  { cat: "DevOps & Tools", color: "#b855ff", icon: "🛠️", items: ["Docker", "Git", "GitHub", "Postman", "VS Code"] },
  { cat: "Infrastructure", color: "#ffd700", icon: "🌐", items: ["Linux", "Windows Server", "TCP/IP", "Virtualization"] },
];

function SkillsSection() {
  const isMobile = useIsMobile();
  return (
    <>
      <SectionDivider color1="#b855ff" color2="#00f5ff" />
      <section id="skills" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
        <GlowOrb x="-5%" y="30%" color={COLORS.purple} size={300} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionHeader tag="02. Skills" title="Technical Arsenal" center />
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {SKILLS.map(({ cat, color, icon, items }, i) => (
              <Reveal key={cat} effect="slideUp" delay={i * 120}>
                <GlassCard accentColor={color}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
                    <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{cat}</h3>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {items.map((name) => (
                      <span key={name} style={{ padding: "4px 10px", borderRadius: 8, background: `${color}15`, border: `1px solid ${color}33`, color: "#fff", fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>
                        {name}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
          <Reveal effect="fadeUp" delay={200}>
            <div style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", gap: "0.6rem", justifyContent: "center" }}>
              {["React", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "PHP", "Laravel", "REST API", "MVC", "Authentication", "MySQL", "SQLite", "Firebase", "Docker", "Git", "GitHub", "Postman", "VS Code", "Linux", "Windows Server", "TCP/IP", "Virtualization"].map(tag => (
                <span key={tag} style={{ padding: "5px 14px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "'Space Grotesk', sans-serif", cursor: "default" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,245,255,0.1)"; e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)"; e.currentTarget.style.color = COLORS.cyan; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

const PROJECTS = [
  {
    title: "PharmaFEFO — Pharmaceutical Stock Management",
    desc: "Developed a pharmaceutical stock management application based on the FEFO (First Expired, First Out) method. The system manages medicine batches, expiration dates, stock entries and exits, expiry alerts, returns, and expired-product loss tracking.",
    tags: ["PHP", "MySQL", "PDO", "MVC", "Bootstrap"],
    color: "#00f5ff",
    emoji: "💊",
    href: "https://github.com/Hamadellah/parmaciefefo.git",
    demo: null
  },
  {
    title: "BDE Events — Student Event Management",
    desc: "Full-stack student event management platform built with a Laravel REST API and React. Includes authentication, role-based access control, event management, reservations, capacity tracking and digital reservation tickets.",
    tags: ["Laravel", "PHP", "React", "MySQL", "REST API", "Sanctum", "Docker"],
    color: "#b855ff",
    emoji: "🎟️",
    href: "https://github.com/Hamadellah/BDE-Events.git",
    demo: null
  },
  {
    title: "LinkUp — Professional Social Network",
    desc: "Developed a professional social networking platform with secure authentication, user profiles, posts, likes, comments, follow/unfollow, reposts, and saved posts. Implemented Laravel Eloquent relationships, Form Requests, middleware, and Policies for access control.",
    tags: ["Laravel", "PHP", "MySQL", "Blade", "Tailwind CSS", "REST API"],
    color: "#ff4d8d",
    emoji: "🌐",
    href: "https://github.com/Hamadellah/linkUP.git",
    demo: null
  },
  {
    title: "EduQuiz — Academic Management Platform",
    desc: "Contributed to a team-based academic management platform featuring dedicated dashboards for administrators, teachers, and students. The application manages users, classes, courses, enrollments, academic progress, and role-based access.",
    tags: ["Laravel", "PHP", "MySQL", "Blade", "Bootstrap"],
    color: "#39d98a",
    emoji: "📚",
    href: "https://github.com/Ihsane-benmouina/EduQuiz-Application-de-Quiz.git",
    demo: null
  },
];

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${hovered ? project.color + "55" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, overflow: "hidden", transition: "all 0.35s ease", transform: hovered ? "translateY(-6px)" : "translateY(0)", boxShadow: hovered ? `0 16px 50px ${project.color}22` : "none" }}>
      <div style={{ height: 150, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${project.color}22, ${project.color}08)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 60, opacity: hovered ? 1 : 0.7, transition: "all 0.3s", transform: hovered ? "scale(1.1)" : "scale(1)" }}>{project.emoji}</div>
        <div style={{ position: "absolute", inset: 0, background: hovered ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.25)", transition: "background 0.3s" }} />
      </div>
      <div style={{ padding: "1rem 1.25rem" }}>
        <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>{project.title}</h3>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6, marginBottom: "0.75rem", fontFamily: "'Space Grotesk', sans-serif" }}>{project.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: "0.9rem" }}>
          {project.tags.map(t => (
            <span key={t} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: `${project.color}18`, color: project.color, border: `1px solid ${project.color}33`, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{t}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href={project.href} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", background: project.color, color: "#000", border: "none", borderRadius: 6, padding: "8px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", textDecoration: "none" }}>GitHub ↗</a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", background: "transparent", color: project.color, border: `1px solid ${project.color}`, borderRadius: 6, padding: "8px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", textDecoration: "none" }}>Live Demo ↗</a>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const isMobile = useIsMobile();
  return (
    <>
    <SectionDivider color1="#00f5ff" color2="#b855ff" />
    <section id="projects" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
      <GlowOrb x="50%" y="20%" color={COLORS.cyan} size={300} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="03. Projects" title="Featured Work" center />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {PROJECTS.map((p, i) => (
            <Reveal key={p.title} effect="slideUp" delay={i * 100}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

function ExperienceSection() {
  const isMobile = useIsMobile();
  const items = [
    { year: "2025–2026", title: "Spécialisation Développement Web PHP", org: "ENAA — École Numérique Ahmed Al Hansali", desc: "Advanced specialization in PHP web development, deepening full-stack skills built during the ISTA program.", color: COLORS.cyan, icon: "💻", kind: "Education" },
    { year: "2022–2024", title: "Technicien Spécialisé en Infrastructures Digitales", org: "ISTA NTIC Beni Mellal — Option Systèmes et Réseaux", desc: "Specialized diploma in digital infrastructure: networking, system administration, virtualization, and PHP/Laravel web development.", color: COLORS.purple, icon: "🎓", kind: "Education" },
    { year: "2023", title: "CCNAv7 – Introduction to Networks", org: "Cisco Networking Academy", desc: "OSI model, TCP/IP, basic routing and switching, IPv4/IPv6 addressing, and Ethernet technologies.", color: COLORS.blue, icon: "🌐", kind: "Certification" },
    { year: "2023", title: "CCNAv7 – Enterprise Networking, Security & Automation", org: "Cisco Networking Academy", desc: "OSPF, BGP, ACLs, VPNs, network security concepts, and automation fundamentals.", color: "#00ff88", icon: "🔒", kind: "Certification" },
  ];

  if (isMobile) {
    return (
      <>
      <SectionDivider color1="#4f8ef7" color2="#b855ff" />
      <section id="experience" style={{ padding: "70px 1.25rem", position: "relative" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionHeader tag="04. Education & Certifications" title="My Journey" />
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", paddingLeft: "1.5rem", borderLeft: `2px solid rgba(0,245,255,0.2)` }}>
            {items.map((item, i) => (
              <Reveal key={item.title} effect="fadeLeft" delay={i * 120}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: -28, top: 18, width: 14, height: 14, borderRadius: "50%", background: item.color, boxShadow: `0 0 12px ${item.color}` }} />
                <GlassCard accentColor={item.color} style={{ padding: "1rem" }}>
                  <span style={{ fontSize: 20, marginBottom: 6, display: "block" }}>{item.icon}</span>
                  <span style={{ fontSize: 11, color: item.color, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 1 }}>{item.kind} · {item.year}</span>
                  <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "5px 0", fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                  <div style={{ fontSize: 12, color: item.color, marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>{item.org}</div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>{item.desc}</p>
                </GlassCard>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      </>
    );
  }

  return (
    <>
    <SectionDivider color1="#4f8ef7" color2="#b855ff" />
    <section id="experience" style={{ padding: "100px 2rem", position: "relative" }}>
      <GlowOrb x="-5%" y="50%" color={COLORS.cyan} size={300} />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <SectionHeader tag="04. Education & Certifications" title="My Journey" center />
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "linear-gradient(180deg, transparent, rgba(0,245,255,0.3), transparent)", transform: "translateX(-50%)" }} />
          {items.map((item, i) => (
            <Reveal key={item.title} effect={i % 2 === 0 ? "fadeLeft" : "fadeRight"} delay={i * 100}>
            <div style={{ display: "flex", gap: "2rem", marginBottom: "2.5rem", flexDirection: i % 2 === 0 ? "row" : "row-reverse", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <GlassCard accentColor={item.color}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                  <span style={{ fontSize: 11, color: item.color, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 1 }}>{item.kind} · {item.year}</span>
                  <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "5px 0", fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                  <div style={{ fontSize: 12, color: item.color, marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>{item.org}</div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>{item.desc}</p>
                </GlassCard>
              </div>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: 18, boxShadow: `0 0 16px ${item.color}`, zIndex: 1 }} />
              <div style={{ flex: 1 }} />
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

const SERVICES = [
  { icon: "⚡", title: "Web Development", desc: "PHP/Laravel and React apps with clean code, MVC architecture, database design, and REST APIs.", color: "#00ff88" },
  { icon: "🌐", title: "Network Design", desc: "LAN/WAN architecture, IP addressing & subnetting, routing, and network documentation.", color: "#00f5ff" },
  { icon: "🖥️", title: "Server Admin", desc: "Windows Server & Linux setup, system administration, and maintenance.", color: "#4f8ef7" },
  { icon: "☁️", title: "Virtualization", desc: "VirtualBox & VMware setup, VM deployment and configuration.", color: "#b855ff" },
  { icon: "🐳", title: "Dockerized Deployments", desc: "Containerizing full-stack apps with Docker for consistent, portable environments.", color: "#ffd700" },
  { icon: "📊", title: "IT Consulting", desc: "Infrastructure planning, tech evaluation, and digital transformation roadmaps.", color: "#ff6b6b" },
];

function ServicesSection() {
  const isMobile = useIsMobile();
  return (
    <>
    <SectionDivider color1="#b855ff" color2="#00ff88" />
    <section id="services" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
      <GlowOrb x="80%" y="40%" color={COLORS.purple} size={300} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="05. Services" title="What I Offer" center />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} effect="slideUp" delay={i * 100}>
            <GlassCard accentColor={s.color}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: "1rem" }}>{s.icon}</div>
              <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>{s.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.7, fontFamily: "'Space Grotesk', sans-serif" }}>{s.desc}</p>
            </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const isMobile = useIsMobile();
  const handle = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <>
    <SectionDivider color1="#00f5ff" color2="#4f8ef7" />
    <section id="contact" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
      <GlowOrb x="20%" y="30%" color={COLORS.cyan} size={300} />
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <SectionHeader tag="06. Contact" title="Let's Connect" center />
        <Reveal effect="fadeIn" delay={100}>
        <GlassCard accentColor={COLORS.cyan} style={{ padding: isMobile ? "1.5rem" : "2.5rem" }}>          {sent ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: 56, marginBottom: "1rem" }}>✅</div>
              <h3 style={{ color: COLORS.cyan, fontSize: 22, fontFamily: "'Space Grotesk', sans-serif" }}>Message sent!</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif" }}>I'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                {[["name", "Name", "Your name"], ["email", "Email", "your@email.com"]].map(([k, label, placeholder]) => (
                  <div key={k}>
                    <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontFamily: "'Space Grotesk', sans-serif" }}>{label}</label>
                    <input value={form[k]} onChange={handle(k)} placeholder={placeholder} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "11px 14px", color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = COLORS.cyan} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontFamily: "'Space Grotesk', sans-serif" }}>Message</label>
                <textarea value={form.msg} onChange={handle("msg")} placeholder="Tell me about your project..." rows={5} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "11px 14px", color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = COLORS.cyan} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <button onClick={() => setSent(true)} style={{ width: "100%", background: "linear-gradient(135deg, #00f5ff, #4f8ef7)", color: "#000", padding: "14px 32px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", fontSize: 15 }}>Send Message ✉️</button>
              <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? "1.25rem" : "2rem", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
                {[["📧", "Email", "hamadellahotman13@gmail.com", "mailto:hamadellahotman13@gmail.com"],
                  ["💼", "LinkedIn", "othmane-hamadellah", "https://www.linkedin.com/in/othmane-hamadellah-83924b310"],
                  ["🐙", "GitHub", "Hamadellah", "https://github.com/Hamadellah"]
                ].map(([icon, label, val, href]) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ textAlign: "center", textDecoration: "none" }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif" }}>{label}</div>
                    <div style={{ fontSize: 11, color: COLORS.cyan, fontFamily: "'Space Grotesk', sans-serif", wordBreak: "break-all" }}>{val}</div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
        </Reveal>
      </div>
    </section>
    </>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "2.5rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 26, fontWeight: 800, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "0.5rem" }}>OH.</div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "1.25rem" }}>Othmane Hamadellah — Full-Stack Web Developer & Infrastructure Technician</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1.25rem" }}>
          {[["💼", "https://www.linkedin.com/in/othmane-hamadellah-83924b310"], ["🐙", "https://github.com/Hamadellah"], ["📧", "mailto:hamadellahotman13@gmail.com"], ["📱", "tel:+212688082991"]].map(([icon, href]) => (
            <a key={href} href={href} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,245,255,0.15)"; e.currentTarget.style.borderColor = "rgba(0,245,255,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              {icon}
            </a>
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "'Space Grotesk', sans-serif" }}>© 2026 Othmane Hamadellah. Crafted with passion.</p>
      </div>
    </footer>
  );
}

function Loader({ onDone }) {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setProg(p => { if (p >= 100) { clearInterval(t); setTimeout(onDone, 300); return 100; } return p + 2; }), 30);
    return () => clearInterval(t);
  }, [onDone]);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#050510", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ fontSize: 44, fontWeight: 900, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "2rem" }}>OH.</div>
      <div style={{ width: 180, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 1, overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{ height: "100%", width: `${prog}%`, background: "linear-gradient(90deg, #00f5ff, #b855ff)", transition: "width 0.05s linear" }} />
      </div>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>Loading... {prog}%</span>
    </div>
  );
}

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const sections = NAV_ITEMS.map(n => n.toLowerCase());
    const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }); }, { threshold: 0.3 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [loaded]);

  if (!loaded) return <Loader onDone={() => setLoaded(true)} />;

  return (
    <div style={{ background: "transparent", minHeight: "100vh", color: "#fff", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #050510; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #050510; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#00f5ff, #b855ff); border-radius: 2px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.9)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes kenburns { 0%{transform:translate(var(--px,0px),var(--py,0px)) scale(1.03)} 100%{transform:translate(var(--px,0px),var(--py,0px)) scale(1.14)} }
        @keyframes aurora1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(12%,8%)} }
        @keyframes aurora2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-10%,-10%)} }
        @media (min-width: 769px) { #hamburger-btn { display: none !important; } }
        @media (max-width: 768px) { #desktop-nav { display: none !important; } #hamburger-btn { display: flex !important; } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
      <VideoBackground />
<CodeRain /> 
      <Navbar active={active} />
      <HeroSection />
      <AboutSection />
      <WhatIBuildSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}