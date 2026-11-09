import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { COLORS, NAV_ITEMS, CV_URL, CV_FILENAME } from "../theme";
import { scrollToSection } from "../utils/scroll";

// useLayoutEffect warns during SSR; this is the standard isomorphic swap.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Navbar({ active, onNavigate, entered = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const [bar, setBar] = useState({ x: 0, w: 0, show: false });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Sliding active-link indicator: measure the active link, move one underline with transform.
  useIsoLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => {
      const el = nav.querySelector(`[data-nav="${active}"]`);
      if (!el || el.offsetParent === null) return setBar((b) => (b.show ? { ...b, show: false } : b));
      setBar({ x: el.offsetLeft, w: el.offsetWidth, show: true });
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(nav);
    document.fonts?.ready.then(measure);
    return () => ro?.disconnect();
  }, [active]);

  // Close the mobile menu with Escape, or when the viewport grows to the desktop layout.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    const onResize = () => window.innerWidth > 768 && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [menuOpen]);

  // Real links (href="#about") so crawlers and keyboard users can follow them;
  // JS upgrades the click to an eased scroll.
  const go = (e, id) => {
    e.preventDefault();
    const key = id.toLowerCase();
    setMenuOpen(false);
    scrollToSection(key, { onStart: onNavigate });
  };

  return (
    <header className="site-header" data-entered={entered ? "true" : "false"} data-scrolled={scrolled ? "true" : "false"} data-open={menuOpen ? "true" : "false"}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, padding: "0 1.25rem" }}>
        <a href="#home" className="nav-logo" onClick={(e) => go(e, "home")} aria-label="Othmane Hamadellah — back to top" style={{ textDecoration: "none", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>OH.</a>
        {/* Desktop nav */}
        <nav id="desktop-nav" ref={navRef} aria-label="Primary" style={{ display: "flex", gap: "1.5rem", alignItems: "center", position: "relative" }}>
          {NAV_ITEMS.map((item) => {
            const key = item.toLowerCase();
            return (
              <a key={item} href={`#${key}`} data-nav={key} className="nav-link" aria-current={active === key ? "true" : undefined} data-active={active === key ? "true" : "false"} onClick={(e) => go(e, item)}>{item}</a>
            );
          })}
          <span className="nav-indicator" aria-hidden="true" style={{ transform: `translateX(${bar.x}px) scaleX(${bar.w / 100})`, opacity: bar.show ? 1 : 0 }} />
          <a href={CV_URL} download={CV_FILENAME} className="nav-cta nav-cta--ghost">Download CV</a>
          <a href="mailto:hamadellahotman13@gmail.com" className="nav-cta nav-cta--solid">Hire Me</a>
        </nav>
        {/* Hamburger (three bars that morph into a cross) */}
        <button id="hamburger-btn" className="hamburger" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((m) => !m)}>
          <span /><span /><span />
        </button>
      </div>
      {/* Mobile menu: always in the DOM, opened with a height + fade transition */}
      <div className="mobile-menu" data-open={menuOpen ? "true" : "false"} inert={!menuOpen}>
        <div className="mobile-menu__inner">
          <nav id="mobile-menu" aria-label="Mobile" style={{ background: "rgba(5,5,16,0.98)", padding: "0.5rem 1.25rem 1.5rem", borderTop: "1px solid rgba(0,245,255,0.1)" }}>
            {NAV_ITEMS.map((item, i) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="mobile-link" data-active={active === item.toLowerCase() ? "true" : "false"} style={{ "--i": i }} onClick={(e) => go(e, item)}>{item}</a>
            ))}
            <a href={CV_URL} download={CV_FILENAME} className="mobile-cta" style={{ "--i": NAV_ITEMS.length, marginTop: "1rem", background: "transparent", color: COLORS.cyan, border: `1px solid ${COLORS.cyan}` }}>Download CV</a>
            <a href="mailto:hamadellahotman13@gmail.com" className="mobile-cta" style={{ "--i": NAV_ITEMS.length + 1, marginTop: "0.75rem", background: "linear-gradient(135deg, #00f5ff, #4f8ef7)", color: "#000" }}>Hire Me</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
