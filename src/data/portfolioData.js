// All portfolio content lives here; components only render it.
// `visual` = { logos: [...] } (files in src/assets/logos) or { icon } (minimal line icon, see common/Icon.jsx).
import { COLORS } from "../theme";
import { SITE } from "./site";

export { SITE };

/* ---------------- About ---------------- */
export const ABOUT = {
  paragraphs: [
    "Full-Stack Web Developer specialized in PHP/Laravel and React, with a background in Digital Infrastructure, Systems and Networks. I build secure, scalable and user-focused web applications, from REST APIs and authentication to modern responsive interfaces.",
    "Motivated and rigorous, I combine backend development, frontend integration and infrastructure knowledge to build complete digital solutions.",
  ],
  facts: [
    { icon: "pin", text: "Beni Mellal, Morocco" },
    { logo: "gmail", text: "hamadellahotman13@gmail.com" },
    { icon: "phone", text: "+212 688082991" },
    { icon: "globe", text: "Arabic, French, English" },
  ],
  highlights: [
    { visual: { logos: ["php", "react"] }, title: "Full-Stack Dev", desc: "PHP, Laravel, REST API on the back end; React, JavaScript on the front end", color: "#00ff88" },
    { visual: { logos: ["laravel", "tailwindcss", "bootstrap"] }, title: "Frameworks", desc: "Laravel, React, Bootstrap, Tailwind CSS", color: "#b855ff" },
    { visual: { logos: ["cisco"] }, title: "Networking", desc: "CCNA certified: TCP/IP configuration, IP addressing & subnetting, routing", color: "#00f5ff" },
    { visual: { logos: ["linux", "windows"] }, title: "Systems", desc: "Windows Server, Linux administration, virtualization (VirtualBox / VMware)", color: "#4f8ef7" },
  ],
};

/* ---------------- What I build ---------------- */
export const WHAT_I_BUILD = [
  { visual: { logos: ["laravel", "react"] }, label: "Full-Stack Web Applications", color: "#00ff88" },
  { visual: { icon: "shield" }, label: "Secure REST APIs & Authentication", color: "#00f5ff" },
  { visual: { icon: "chart" }, label: "Admin Dashboards", color: "#4f8ef7" },
  { visual: { icon: "ticket" }, label: "Event & Reservation Systems", color: "#b855ff" },
  { visual: { logos: ["react"] }, label: "Responsive React Interfaces", color: "#ff4d8d" },
  { visual: { logos: ["docker"] }, label: "Dockerized Applications", color: "#ffd700" },
];

/* ---------------- Skills ---------------- */
// `logo` / `icon` per item; items without an official logo (REST API, MVC, ...) get a minimal icon.
export const SKILLS = [
  { cat: "Frontend", color: "#00ff88", visual: { logos: ["react"] }, items: [
    { name: "React", logo: "react" }, { name: "JavaScript", logo: "javascript" }, { name: "HTML", logo: "html5" },
    { name: "CSS", logo: "css3" }, { name: "Tailwind CSS", logo: "tailwindcss" }, { name: "Bootstrap", logo: "bootstrap" } ] },
  { cat: "Backend", color: "#00f5ff", visual: { logos: ["laravel"] }, items: [
    { name: "PHP", logo: "php" }, { name: "Laravel", logo: "laravel" }, { name: "REST API", icon: "swap" },
    { name: "MVC", icon: "layers" }, { name: "Authentication", icon: "lock" } ] },
  { cat: "Database", color: "#4f8ef7", visual: { logos: ["mysql"] }, items: [
    { name: "MySQL", logo: "mysql" }, { name: "SQLite", logo: "sqlite" }, { name: "Firebase", logo: "firebase" } ] },
  { cat: "DevOps & Tools", color: "#b855ff", visual: { logos: ["docker"] }, items: [
    { name: "Docker", logo: "docker" }, { name: "Git", logo: "git" }, { name: "GitHub", logo: "github" },
    { name: "Postman", logo: "postman" }, { name: "VS Code", logo: "vscode" } ] },
  { cat: "Infrastructure", color: "#ffd700", visual: { logos: ["linux"] }, items: [
    { name: "Linux", logo: "linux" }, { name: "Windows Server", logo: "windows" }, { name: "TCP/IP", icon: "network" },
    { name: "Virtualization", icon: "server" } ] },
];

/* ---------------- Projects ---------------- */
// `image`: banner file name in src/assets/projects (see tools/make_project_thumbs.mjs). Replace with a real screenshot if you have one.
export const PROJECTS = [
  {
    title: "PharmaFEFO — Pharmaceutical Stock Management",
    desc: "Developed a pharmaceutical stock management application based on the FEFO (First Expired, First Out) method. The system manages medicine batches, expiration dates, stock entries and exits, expiry alerts, returns, and expired-product loss tracking.",
    tags: ["PHP", "MySQL", "PDO", "MVC", "Bootstrap"],
    color: "#00f5ff",
    image: "pharmafefo",
    imageAlt: "PHP, MySQL and Bootstrap logos: the technology stack of PharmaFEFO",
    href: "https://github.com/Hamadellah/parmaciefefo.git",
    demo: null,
  },
  {
    title: "BDE Events — Student Event Management",
    desc: "Full-stack student event management platform built with a Laravel REST API and React. Includes authentication, role-based access control, event management, reservations, capacity tracking and digital reservation tickets.",
    tags: ["Laravel", "PHP", "React", "MySQL", "REST API", "Sanctum", "Docker"],
    color: "#b855ff",
    image: "bde-events",
    imageAlt: "Laravel, React, MySQL and Docker logos: the technology stack of BDE Events",
    href: "https://github.com/Hamadellah/BDE-Events.git",
    demo: null,
  },
   {
    title: "InService — Service Marketplace Platform",
    desc: "Full-stack service marketplace built with a Laravel REST API and React. Allows clients to find service providers, request services and manage interventions. Includes authentication, role-based access control, service management and user dashboards.",
    tags: ["Laravel", "PHP", "React", "MySQL", "REST API", "Sanctum", "Docker"],
    color: "#b855ff",
    image: "bde-events",
    imageAlt: "Laravel, React, MySQL and Docker logos: the technology stack of BDE Events",
    href: "https://github.com/Hamadellah/InService",
    demo: "https://inservice-frontend-db5f4e55534d.herokuapp.com/",
  },
  
];

/* ---------------- Education & certifications ---------------- */
export const TIMELINE = [
  { year: "2025–2026", title: "Spécialisation Développement Web PHP", org: "ENAA — École Numérique Ahmed Al Hansali", desc: "Advanced specialization in PHP web development, deepening full-stack skills built during the ISTA program.", color: COLORS.cyan, visual: { logos: ["php", "laravel"] }, kind: "Education" },
  { year: "2022–2024", title: "Technicien Spécialisé en Infrastructures Digitales", org: "ISTA NTIC Beni Mellal — Option Systèmes et Réseaux", desc: "Specialized diploma in digital infrastructure: networking, system administration, virtualization, and PHP/Laravel web development.", color: COLORS.purple, visual: { icon: "graduation" }, kind: "Education" },
  { year: "2023", title: "CCNAv7 – Introduction to Networks", org: "Cisco Networking Academy", desc: "OSI model, TCP/IP, basic routing and switching, IPv4/IPv6 addressing, and Ethernet technologies.", color: COLORS.blue, visual: { logos: ["cisco"] }, kind: "Certification" },
  { year: "2023", title: "CCNAv7 – Enterprise Networking, Security & Automation", org: "Cisco Networking Academy", desc: "OSPF, BGP, ACLs, VPNs, network security concepts, and automation fundamentals.", color: "#00ff88", visual: { logos: ["cisco"] }, kind: "Certification" },
];

/* ---------------- Services ---------------- */
export const SERVICES = [
  { visual: { logos: ["laravel", "react"] }, title: "Web Development", desc: "PHP/Laravel and React apps with clean code, MVC architecture, database design, and REST APIs.", color: "#00ff88" },
  { visual: { logos: ["cisco"] }, title: "Network Design", desc: "LAN/WAN architecture, IP addressing & subnetting, routing, and network documentation.", color: "#00f5ff" },
  { visual: { logos: ["linux", "windows"] }, title: "Server Admin", desc: "Windows Server & Linux setup, system administration, and maintenance.", color: "#4f8ef7" },
  { visual: { logos: ["virtualbox", "vmware"] }, title: "Virtualization", desc: "VirtualBox & VMware setup, VM deployment and configuration.", color: "#b855ff" },
  { visual: { logos: ["docker"] }, title: "Dockerized Deployments", desc: "Containerizing full-stack apps with Docker for consistent, portable environments.", color: "#ffd700" },
  { visual: { icon: "briefcase" }, title: "IT Consulting", desc: "Infrastructure planning, tech evaluation, and digital transformation roadmaps.", color: "#ff6b6b" },
];

/* ---------------- Contact / footer ---------------- */
export const CONTACT_LINKS = [
  { key: "email", label: "Email", value: "hamadellahotman13@gmail.com", href: "mailto:hamadellahotman13@gmail.com", logo: "gmail", external: false },
  { key: "linkedin", label: "LinkedIn", value: "othmane-hamadellah", href: "https://www.linkedin.com/in/othmane-hamadellah-83924b310", logo: "linkedin", external: true },
  { key: "github", label: "GitHub", value: "Hamadellah", href: "https://github.com/Hamadellah", logo: "github", external: true },
];

export const FOOTER_LINKS = [
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/othmane-hamadellah-83924b310", logo: "linkedin", external: true },
  { key: "github", label: "GitHub", href: "https://github.com/Hamadellah", logo: "github", external: true },
  { key: "email", label: "Email", href: "mailto:hamadellahotman13@gmail.com", logo: "gmail" },
  { key: "phone", label: "Phone", href: "tel:+212688082991", icon: "phone" },
];

export const FOOTER_TAGLINE = "Othmane Hamadellah — Full-Stack Web Developer & Infrastructure Technician";
