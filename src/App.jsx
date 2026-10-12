// src/App.jsx
import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import MicroSlats from "./MicroSlats";

import {
  FaCode,
  FaDatabase,
  FaJava,
  FaPython,
  FaHtml5,
  FaCss3Alt,
  FaGithub,
  FaGitAlt,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaCopy,
  FaCheck,
  FaAws
} from "react-icons/fa";
import { TbBrandCSharp, TbBrandCpp } from "react-icons/tb";
import {
  SiHuggingface,
  SiPostman,
  SiGooglegemini
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";

const portfolioData = {
  name: "Atilla Değirmenci",
  title: "Computer Engineering Student",
  location: "Istanbul, Turkey",
  email: "atilladegirmenci04@gmail.com",
  about:
    "I develop backend systems, RESTful APIs, and cloud-based solutions using C# and .NET. I have hands-on experience with AWS serverless architectures and integrating AI tools into applications. I value clean architecture principles and enjoy turning complex problems into effective software solutions.",
  education: {
    school: "Düzce University",
    department: "Computer Engineering",
    date: "7/2022 - 10/2026",
    website: "https://duzce.edu.tr/",
  },
  experience: {
    role: "Backend Developer Intern",
    company: "EPAM Systems Turkiye",
    location: "Istanbul, Turkiye",
    date: "07/2026 – 09/2026",
    website: "https://www.epam.com/",
    description: [
      "Actively contributed to backend development for large-scale software projects in collaboration with international mentors and engineers.",
      "Designed and developed production-grade, cloud-based, and scalable microservices using various AWS serverless services.",
      "Collaborated with multinational teams in an Agile environment, conducting all technical meetings and written communication entirely in English."
    ]
  },
  techStack: [
    { name: "C#", icon: <TbBrandCSharp />, color: "#239120" },
    { name: ".NET", icon: <FaCode />, color: "#512BD4" },
    { name: "AWS", icon: <FaAws />, color: "#FF9900" },
    { name: "Azure", icon: <VscAzure />, color: "#0078D4" },
    { name: "Hugging Face", icon: <SiHuggingface />, color: "#FFD21E" },
    { name: "Postman", icon: <SiPostman />, color: "#FF6C37" },
    { name: "Java", icon: <FaJava />, color: "#007396" },
    { name: "Python", icon: <FaPython />, color: "#3776AB" },
    { name: "GitHub", icon: <FaGithub />, color: "#FFFFFF" },
    { name: "AI Integration & Dev", icon: <SiGooglegemini />, color: "#8E75B2" },
    { name: "SQL & Databases", icon: <FaDatabase />, color: "#CC2927" },
    { name: "Git", icon: <FaGitAlt />, color: "#F05032" },
    { name: "HTML5", icon: <FaHtml5 />, color: "#E34F26" },
    { name: "CSS3", icon: <FaCss3Alt />, color: "#1572B6" },
  ],
  projects: [
    {
      title: "TruthLens - Fake News AI",
      description:
        "AI-powered hybrid fake news detection and fact check system. Combines a custom Fine-Tuned BERT model, Google Gemini 3.0 Flash for logical reasoning, and Google Fact Check Tools for verification. Built with .NET 8 & Blazor WebAssembly.",
      tags: [".NET Core", "C#", "OCR", "ML", "AI", "Google"],
      link: "https://atilladegirmenci.github.io/TruthLens/",
      type: "web",
      image: "/images/truthlens.png",
    },
    {
      title: "Smart Summary Assistant",
      description:
        "A comprehensive media summarization tool that leverages AI to transcribe and summarize content. Users can upload local audio/video files or provide YouTube links to get summaries tailored to their specific needs",
      tags: [".NET Core", "C#", "Groq", "Gemini", "API", "LLM"],
      link: "https://atilladegirmenci.github.io/SmartSummaryAssistant/",
      type: "web",
      image: "/images/smartsummary.png",
    },
  ],
  links: {
    github: "https://github.com/atilladegirmenci",
    linkedin: "https://www.linkedin.com/in/atilla-de%C4%9Firmenci-74b243254/",
    instagram: "https://www.instagram.com/atilla__d/",
  },
};

// Static calculations moved outside the component for performance optimization
const halfLength = Math.ceil(portfolioData.techStack.length / 2);
const row1 = portfolioData.techStack.slice(0, halfLength);
const row2 = portfolioData.techStack.slice(halfLength);
const infiniteRow1 = [...row1, ...row1, ...row1];
const infiniteRow2 = [...row2, ...row2, ...row2];
// Added 'experience' to the sections array so it appears in the navbar
const sections = ["about", "experience", "education", "skills", "projects", "contact-me"];

function App() {
  const [activeSection, setActiveSection] = useState("about");
  const [copied, setCopied] = useState(false);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const namespace = "atilladegirmenci.github.io";
    const key = "portfolio_visits";

    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
        .then((res) => res.json())
        .then((data) => {
          setVisitCount(data.value);
          localStorage.setItem("hasVisited", "true");
        })
        .catch((err) => console.error("Increment counter error:", err));
    } else {
      fetch(`https://api.countapi.xyz/get/${namespace}/${key}`)
        .then((res) => res.json())
        .then((data) => setVisitCount(data.value))
        .catch((err) => console.error("Read counter error:", err));
    }
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-brand-muted selection:text-brand-accent flex flex-col relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_var(--tw-gradient-stops))] from-[#11141C] via-[#090d16] to-[#000000]"></div>
        <div className="absolute inset-0 opacity-80">
          <MicroSlats
            preset="tide"
            color="#47018a"
            glintColor="#708090 "
            backgroundColor="transparent"
            slatWidth={7}
            slatHeight={25}
            gap={4}
            roundness={1}
            interactive
            cursorStrength={0.5}
            cursorSize={40}
            swirl={0}
            trail={1.1}
            lean={0}
            intro ={false}
            scale={1.3}
            speed={0.35}
            direction={262}
            chop={0.2}
            stretch={0.12}
            glint={0.4}
            contrast={1.6}
            perspective={0.5}
            fog={0.4}
            introDuration={1.2}
            paused={false}
          />
        </div>
      </div>

      <div className="relative z-10 w-full flex flex-col flex-grow">
        <nav className="fixed top-0 w-full bg-brand-base/80 backdrop-blur-md border-b border-brand-card/50 z-50 transition-all">
          <div className="max-w-4xl mx-auto px-6 h-16 flex justify-center items-center">
            <div className="flex gap-8 md:gap-12 overflow-x-auto no-scrollbar">
              {sections.map((sectionId) => {
                const isActive = activeSection === sectionId;
                const label = sectionId
                  .replace("-", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());

                return (
                  <a
                    key={sectionId}
                    href={`#${sectionId}`}
                    className={`relative py-5 text-sm font-medium transition-colors duration-300 cursor-pointer whitespace-nowrap
                      ${
                        isActive
                          ? "text-brand-accent"
                          : "text-brand-muted opacity-50 hover:opacity-100"
                      } 
                    `}
                  >
                    {label === "Contact Me" ? "Contact Me" : label}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent rounded-t-full transition-transform duration-300 origin-left will-change-transform ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    ></span>
                  </a>
                );
              })}
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-24 md:space-y-32 flex-grow">
          <header
            id="about"
            className="pt-32 md:pt-40 scroll-mt-24 flex flex-col-reverse md:flex-row items-center md:items-start gap-16"
          >
            <div className="flex-1 md:basis-2/3 text-center md:text-left md:pr-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-white">
                {portfolioData.name}
              </h1>
              <h2 className="text-xl md:text-2xl text-brand-accent font-medium mb-6">
                {portfolioData.title}
              </h2>
              <p className="text-brand-muted text-lg leading-relaxed text-justify">
                {portfolioData.about}
              </p>
              <div className="flex justify-end items-center gap-2 text-brand-muted mt-2 text-sm italic opacity-70">
                <span>📍</span>
                <span>{portfolioData.location}</span>
              </div>
            </div>

            <div className="flex-1 md:basis-1/3 flex flex-col items-center gap-6 shrink-0 group cursor-default">
              <div className="relative">
               <div className="absolute -inset-2 bg-gradient-to-tr from-white/10 via-white/40 to-transparent rounded-full blur-lg opacity-40 group-hover:opacity-80 transition duration-1000"></div>
                <img
                  src="/images/me.jpeg"
                  alt="Profile"
                  width="288"
                  height="288"
                  fetchPriority="high"
                  loading="eager"
                  className="relative w-72 h-72 rounded-full object-cover border-4 border-brand-card shadow-2xl"
                />
              </div>
              <a
                href="/CV_EN_Atilla_Degirmenci.pdf"
                download="Atilla_Degirmenci_CV.pdf"
                className="px-8 py-3 bg-[#060340]/30 backdrop-blur-md border border-white/10 text-white font-bold rounded-lg hover:bg-brand-accent hover:text-white hover:border-brand-accent hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-brand-accent/10"
              >
                Download CV
              </a>
            </div>
          </header>

          <section id="experience" className="scroll-mt-24">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-brand-accent">
              <span className="w-8 h-1 bg-brand-accent rounded-full"></span>
              Work Experience
            </h3>
            <div className="relative rounded-xl border border-slate-800 overflow-hidden shadow-xl p-8 md:p-10 group bg-slate-950/60 backdrop-blur-xl hover:border-slate-700 hover:shadow-brand-accent/20 hover:shadow-2xl transition-all duration-300">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-brand-secondary/50 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                <div>
                  <div className="text-brand-muted font-bold text-xs mb-2 uppercase tracking-widest opacity-60">
                    Internship
                  </div>
                  <h4 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {portfolioData.experience.role}
                  </h4>
                  <a
                    href={portfolioData.experience.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-accent hover:text-white transition-colors text-lg flex items-center gap-2"
                  >
                    {portfolioData.experience.company} ({portfolioData.experience.location})
                    <span className="text-xs opacity-50">↗</span>
                  </a>
                </div>
                <div className="px-4 py-2 rounded-full border border-white/10 bg-black/30 text-brand-muted text-sm font-mono backdrop-blur-md">
                  {portfolioData.experience.date}
                </div>
              </div>
              <ul className="relative z-10 space-y-3 text-brand-muted text-base leading-relaxed list-disc list-inside">
                {portfolioData.experience.description.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section id="education" className="scroll-mt-24">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-brand-accent">
              <span className="w-8 h-1 bg-brand-accent rounded-full"></span>
              Education
            </h3>
             <div className="relative rounded-xl border border-slate-800 overflow-hidden shadow-xl p-8 md:p-10 group bg-slate-950/60 backdrop-blur-xl hover:border-slate-700 hover:shadow-brand-accent/20 hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-brand-secondary/50 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="text-brand-muted font-bold text-xs mb-2 uppercase tracking-widest opacity-60">
                    Bachelor's Degree
                  </div>
                  <h4 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {portfolioData.education.department}
                  </h4>
                  <a
                    href={portfolioData.education.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-accent hover:text-white transition-colors text-lg flex items-center gap-2"
                  >
                    {portfolioData.education.school}
                    <span className="text-xs opacity-50">↗</span>
                  </a>
                </div>
                <div className="flex flex-col items-start md:items-end gap-3">
                  <div className="px-4 py-2 rounded-full border border-white/10 bg-black/30 text-brand-muted text-sm font-mono backdrop-blur-md">
                    {portfolioData.education.date}
                  </div>
                  <div className="px-4 py-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-sm font-bold backdrop-blur-md shadow-[0_0_15px_rgba(126,34,206,0.2)]">
                    GPA: 3.24
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="skills" className="scroll-mt-24">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-brand-accent">
              <span className="w-8 h-1 bg-brand-accent rounded-full"></span>
              Tech Stack
            </h3>
            <div
              className="relative overflow-hidden space-y-8 py-4"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              }}
            >
              <div className="flex w-max animate-scroll-left hover:[animation-play-state:paused] gap-6">
                {infiniteRow1.map((tech, index) => (
                  <div
                    key={`r1-${index}`}
                    className="flex items-center gap-3 px-6 py-3 border rounded-full transition-all whitespace-nowrap min-w-[150px] justify-center backdrop-blur-sm"
                    style={{
                      backgroundColor: `${tech.color}10`,
                      borderColor: `${tech.color}25`,
                      boxShadow: `0 0 15px ${tech.color}08`,
                    }}
                  >
                    <span className="text-2xl" style={{ color: tech.color }}>
                      {tech.icon}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{
                        color:
                          tech.color === "#FFFFFF" ? "#b3b3b3" : tech.color,
                      }}
                    >
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex w-max animate-scroll-right hover:[animation-play-state:paused] gap-6">
                {infiniteRow2.map((tech, index) => (
                  <div
                    key={`r2-${index}`}
                    className="flex items-center gap-3 px-6 py-3 border rounded-full transition-all whitespace-nowrap min-w-[150px] justify-center backdrop-blur-sm"
                    style={{
                      backgroundColor: `${tech.color}10`,
                      borderColor: `${tech.color}25`,
                      boxShadow: `0 0 15px ${tech.color}08`,
                    }}
                  >
                    <span className="text-2xl" style={{ color: tech.color }}>
                      {tech.icon}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{
                        color:
                          tech.color === "#FFFFFF" ? "#b3b3b3" : tech.color,
                      }}
                    >
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="projects" className="scroll-mt-24">
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-2xl font-bold text-brand-accent flex items-center gap-3">
                <span className="w-8 h-1 bg-brand-accent rounded-full"></span>
                Personal Projects
              </h3>
              <div className="flex items-center gap-4 text-brand-muted">
                <span className="text-sm font-medium hidden sm:inline">
                  View All →
                </span>
                <div className="flex gap-3">
                  <a
                    href={portfolioData.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl hover:text-brand-accent transition-colors hover:scale-110 duration-200"
                    title="GitHub"
                  >
                    <FaGithub />
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolioData.projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </section>

          <section id="contact-me" className="scroll-mt-24 pb-20">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-brand-accent">
              <span className="w-8 h-1 bg-brand-accent rounded-full"></span>
              Contact Me
            </h3>

            <div className="rounded-xl border border-slate-800 overflow-hidden shadow-xl p-12 text-center relative bg-slate-950/60 backdrop-blur-xl group hover:border-slate-700 hover:shadow-brand-accent/20 hover:shadow-2xl transition-all duration-300">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-brand-secondary/30 rounded-full blur-[100px] pointer-events-none group-hover:bg-brand-secondary/50 transition-colors duration-500"></div>

              <h4 className="text-2xl font-bold text-white mb-4 relative z-10">
                Let's Work Together
              </h4>
              <p className="text-brand-muted max-w-xl mx-auto mb-10 opacity-80 relative z-10">
                I am currently open to new career opportunities in backend engineering and software development.
              </p>

              <div className="mb-10 relative z-10 flex flex-col items-center gap-2">
                <div
                  onClick={handleCopyEmail}
                  className="group/mail cursor-pointer flex items-center gap-3 transition-all active:scale-95"
                  title="Click to Copy"
                >
                  <span className="text-xl md:text-3xl font-bold text-white tracking-wide group-hover/mail:text-brand-accent transition-colors">
                    {portfolioData.email}
                  </span>
                  <span className="text-brand-muted opacity-50 group-hover/mail:opacity-100 transition-opacity">
                    {copied ? (
                      <FaCheck className="text-brand-accent" />
                    ) : (
                      <FaCopy />
                    )}
                  </span>
                </div>
                <span
                  className={`text-xs text-brand-accent font-mono transition-opacity duration-300 ${
                    copied ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Copied to clipboard!
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-8 relative z-10">
                <a
                  href={`mailto:${portfolioData.email}`}
                  className="text-4xl text-brand-muted hover:text-white hover:scale-110 transition-all duration-300 drop-shadow-lg"
                  title="Send Email"
                >
                  <FaEnvelope />
                </a>
                <a
                  href={portfolioData.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-4xl text-brand-muted hover:text-[#0077B5] hover:scale-110 transition-all duration-300 drop-shadow-lg"
                  title="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href={portfolioData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-4xl text-brand-muted hover:text-white hover:scale-110 transition-all duration-300 drop-shadow-lg"
                  title="GitHub"
                >
                  <FaGithub />
                </a>
                <a
                  href={portfolioData.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-4xl text-brand-muted hover:text-[#E4405F] hover:scale-110 transition-all duration-300 drop-shadow-lg"
                  title="Instagram"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="w-full py-6 text-center text-brand-muted text-sm bg-black/20 backdrop-blur-md border-t border-white/5">
          <p>
            Designed & Built by{" "}
            <span className="text-brand-accent font-bold">
              {portfolioData.name}
            </span>{" "}
            © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;