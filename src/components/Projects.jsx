import { useState } from "react";
import { COLORS } from "../theme";
import { useIsMobile } from "../hooks";
import { PROJECTS } from "../data/portfolioData";
import { Reveal, SectionDivider, SectionTitle, GlowOrb, ImageCard } from "./common";

// src/assets/projects/<name>.{svg,webp,png,jpg}: picked up automatically.
const banners = import.meta.glob("../assets/projects/*.{svg,webp,png,jpg,jpeg}", { eager: true, query: "?url", import: "default" });
const bannerUrl = (name) => Object.entries(banners).find(([p]) => p.split("/").pop().replace(/\.\w+$/, "") === name)?.[1];

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${hovered ? project.color + "55" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, overflow: "hidden", transition: "all 0.35s ease", transform: hovered ? "translateY(-6px)" : "translateY(0)", boxShadow: hovered ? `0 16px 50px ${project.color}22` : "none" }}>
      <ImageCard src={bannerUrl(project.image)} alt={project.imageAlt} color={project.color} hovered={hovered} />
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

export default function Projects() {
  const isMobile = useIsMobile();
  return (
    <>
    <SectionDivider color1="#00f5ff" color2="#b855ff" />
    <section id="projects" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
      <GlowOrb x="50%" y="20%" color={COLORS.cyan} size={300} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle tag="03. Projects" title="Featured Work" center />
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
