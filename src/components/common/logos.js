// Every file in src/assets/logos is available by name: logoUrl("react") -> hashed asset URL.
const files = import.meta.glob("../../assets/logos/*.svg", { eager: true, query: "?url", import: "default" });
const byName = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split("/").pop().replace(".svg", ""), url])
);

export const LOGO_LABELS = {
  react: "React", javascript: "JavaScript", html5: "HTML5", css3: "CSS3", tailwindcss: "Tailwind CSS",
  bootstrap: "Bootstrap", php: "PHP", laravel: "Laravel", mysql: "MySQL", sqlite: "SQLite", firebase: "Firebase",
  docker: "Docker", git: "Git", github: "GitHub", postman: "Postman", vscode: "Visual Studio Code",
  linux: "Linux", windows: "Windows", linkedin: "LinkedIn", gmail: "Gmail", cisco: "Cisco",
  virtualbox: "VirtualBox", vmware: "VMware",
};

export const logoUrl = (name) => byName[name];
export const logoAlt = (name) => `${LOGO_LABELS[name] ?? name} logo`;
