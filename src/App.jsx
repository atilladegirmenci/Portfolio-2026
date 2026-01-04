// src/App.jsx
import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import VerticalBarsNoise from './VerticalBarsNoise'; // Yeni animasyon bileşeni

// İkonlar
import { 
  FaGamepad, FaCode, FaDatabase, FaJava, FaPython, FaHtml5, FaCss3Alt, 
  FaGithub, FaItchIo, FaGitAlt, FaLinkedin, FaInstagram, FaEnvelope, FaCopy, FaCheck 
} from "react-icons/fa";
import { TbBrandCSharp, TbBrandCpp } from "react-icons/tb";
import { BiLogoUnity } from "react-icons/bi";
import { SiHuggingface, SiGooglegemini, SiRapid, SiGithub, SiPostman } from "react-icons/si";
import { VscAzure } from "react-icons/vsc"; 

// --- VERİLERİN ---
const portfolioData = {
  name: "Atilla Değirmenci",
  title: "Computer Engineering Student",
  location: "Istanbul, Turkey",
  email: "atilladegirmenci04@gmail.com",
  about: "As a Senior Computer Engineering student, I bridge the gap between creative game mechanics and robust software architecture. My technical journey is defined by a deep focus on the .NET ecosystem (C#) and Game Development with Unity. Beyond just writing code, I am passionate about understanding the 'why' behind architectural decisions.",
  education: {
    school: "Düzce University",
    department: "Computer Engineering",
    date: "2022 - Current",
    website: "https://duzce.edu.tr/"
  },
  techStack: [
    { name: "C#", icon: <TbBrandCSharp />, color: "#239120" }, 
    { name: ".NET", icon: <FaCode />, color: "#512BD4" }, 
    { name: "Unity", icon: <BiLogoUnity />, color: "#FFFFFF" }, 
    { name: "Azure", icon: <VscAzure />, color: "#0078D4" }, 
    { name: "Hugging Face", icon: <SiHuggingface />, color: "#FFD21E" }, 
    { name: "Postman", icon: <SiPostman />, color: "#FF6C37" }, 
    { name: "Java", icon: <FaJava />, color: "#007396" }, 
    { name: "Python", icon: <FaPython />, color: "#3776AB" }, 
    { name: "GitHub", icon: <SiGithub />, color: "#FFFFFF" }, 
    { name: "RapidAPI", icon: <SiRapid />, color: "#0055DA" }, 
    { name: "C++", icon: <TbBrandCpp />, color: "#00599C" }, 
    { name: "SQL", icon: <FaDatabase />, color: "#CC2927" }, 
    { name: "Git", icon: <FaGitAlt />, color: "#F05032" }, 
    { name: "HTML5", icon: <FaHtml5 />, color: "#E34F26" }, 
    { name: "CSS3", icon: <FaCss3Alt />, color: "#1572B6" }, 
  ],
  projects: [
    {
      title: "TruthLens - Fake News AI",
      description: "AI-powered hybrid fake news detection and fact check system. Combines a custom Fine-Tuned BERT model, Google Gemini 3.0 Flash for logical reasoning, and Google Fact Check Tools for verification. Built with .NET 8 & Blazor WebAssembly.",
      tags: [".NET Core", "C#", "OCR", "ML","AI","Google"],
      link: "https://atilladegirmenci.github.io/TruthLens/", 
      type: "web",
      image: "/images/truthlens.png"
    },
    {
      title: "Smart Summary Assistant",
      description: "A comprehensive media summarization tool that leverages AI to transcribe and summarize content. Users can upload local audio/video files or provide YouTube links to get summaries tailored to their specific needs",
      tags: [".NET Core", "Groq", "Gemini", "API","LLM"],
      link: "https://atilladegirmenci.github.io/SmartSummaryAssistant/",
      type: "web",
      image: "/images/smartsummary.png"
    },
    {
      title: "A Hyper-Casual Game: Tubes",
      description: "A color-based tray filling puzzle game built with Unity. Tubes are queued, matched by color, and automatically placed into the correct trays.",
      tags: ["Unity 3D", "C#", "HLSL", "Game Design"],
      link: "https://ati555.itch.io/tubes-a-puzzle-game",
      type: "game",
      image: "/images/game.png"
    }
  ],
  links: {
    github: "https://github.com/atilladegirmenci",
    itchio: "https://ati555.itch.io",
    linkedin: "https://www.linkedin.com/in/atilla-de%C4%9Firmenci-74b243254/",
    instagram: "https://www.instagram.com/atilla__d/"
  }
};

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'education', 'skills', 'projects', 'contact-me'];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const halfLength = Math.ceil(portfolioData.techStack.length / 2);
  const row1 = portfolioData.techStack.slice(0, halfLength);
  const row2 = portfolioData.techStack.slice(halfLength);

  return (
    // Ana kapsayıcı relative yapıldı, içerik z-index ile öne çıkarılacak
    <div className="min-h-screen font-sans selection:bg-brand-muted selection:text-brand-accent flex flex-col relative">
      
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <VerticalBarsNoise 
           backgroundColor="#121212" // Arka plan hala koyu gri (yoksa siyah çizgiler görünmez)
           lineColor="#000000"       // Sabit çizgiler: Tam Siyah
           barColor="#000000"        // Hareketli barlar: Tam Siyah
           animationSpeed={0.0005}
           lineWidth={1}
         />
      </div>

      {/* --- ANA İÇERİK (z-10 ile animasyonun üstüne çıkarıldı) --- */}
      <div className="relative z-10 w-full flex flex-col flex-grow">
        
        {/* --- TOP NAVBAR --- */}
        <nav className="fixed top-0 w-full bg-brand-base/80 backdrop-blur-md border-b border-brand-card/50 z-50 transition-all">
          <div className="max-w-4xl mx-auto px-6 h-16 flex justify-center items-center">
            <div className="flex gap-8 md:gap-12 overflow-x-auto no-scrollbar">
              {['About', 'Education', 'Skills', 'Projects', 'Contact Me'].map((item) => {
                const sectionId = item.toLowerCase().replace(' ', '-');
                const isActive = activeSection === sectionId;
                return (
                  <a 
                    key={item}
                    href={`#${sectionId}`}
                    className={`relative py-5 text-sm font-medium transition-colors duration-300 cursor-pointer whitespace-nowrap
                      ${isActive ? 'text-brand-accent' : 'text-brand-muted opacity-50 hover:opacity-100'} 
                    `}
                  >
                    {item}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent rounded-t-full transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
                  </a>
                );
              })}
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-24 md:space-y-32 flex-grow">
          
          {/* --- ABOUT SECTION --- */}
          <header id="about" className="pt-32 md:pt-40 scroll-mt-24 flex flex-col-reverse md:flex-row items-center md:items-start gap-16">
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
                  {/* Mor Işık Efekti */}
                  <div className="absolute -inset-2 bg-gradient-to-tr from-brand-card via-brand-accent to-brand-muted rounded-full blur-md opacity-40 group-hover:opacity-70 transition duration-1000"></div>
                  <img 
                   src="/images/me.jpeg" 
                   alt="Profile" 
                   className="relative w-72 h-72 rounded-full object-cover border-4 border-brand-card shadow-2xl"
                 />
               </div>
              <a 
                href="/cv.pdf" 
                download="Atilla_Degirmenci_CV.pdf"
                className="px-8 py-3 bg-[#060340]/30 backdrop-blur-md border border-white/10 text-white font-bold rounded-lg hover:bg-brand-accent hover:text-white hover:border-brand-accent hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-brand-accent/10"
              >
                Download CV
              </a>
            </div>
          </header>

          {/* --- EDUCATION SECTION --- */}
          <section id="education" className="scroll-mt-24">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-brand-accent">
              <span className="w-8 h-1 bg-brand-accent rounded-full"></span>
              Education
            </h3>
            <div className="relative rounded-xl border border-white/5 overflow-hidden shadow-lg p-8 md:p-10 group bg-[#060340]/30 backdrop-blur-xl hover:shadow-brand-accent/20 hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-brand-secondary/50 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                   <div className="text-brand-muted font-bold text-xs mb-2 uppercase tracking-widest opacity-60">Bachelor's Degree</div>
                   <h4 className="text-3xl md:text-4xl font-bold text-white mb-2">{portfolioData.education.department}</h4>
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
                     GPA: 3.18
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- SKILLS SECTION --- */}
          <section id="skills" className="scroll-mt-24">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-brand-accent">
              <span className="w-8 h-1 bg-brand-accent rounded-full"></span>
              Tech Stack
            </h3>
            <div 
              className="relative overflow-hidden space-y-8 py-4"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
              }}
            >
              <div className="flex w-max animate-scroll-left hover:[animation-play-state:paused] gap-6">
                {[...row1, ...row1, ...row1].map((tech, index) => (
                  <div 
                    key={`r1-${index}`} 
                    className="flex items-center gap-3 px-6 py-3 border rounded-full transition-all whitespace-nowrap min-w-[150px] justify-center backdrop-blur-sm"
                    style={{ backgroundColor: `${tech.color}10`, borderColor: `${tech.color}25`, boxShadow: `0 0 15px ${tech.color}08` }}
                  >
                    <span className="text-2xl" style={{ color: tech.color }}>{tech.icon}</span>
                    <span className="text-sm font-medium" style={{ color: tech.color === '#FFFFFF' ? '#b3b3b3' : tech.color }}>{tech.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex w-max animate-scroll-right hover:[animation-play-state:paused] gap-6">
                {[...row2, ...row2, ...row2].map((tech, index) => (
                  <div 
                    key={`r2-${index}`} 
                    className="flex items-center gap-3 px-6 py-3 border rounded-full transition-all whitespace-nowrap min-w-[150px] justify-center backdrop-blur-sm"
                    style={{ backgroundColor: `${tech.color}10`, borderColor: `${tech.color}25`, boxShadow: `0 0 15px ${tech.color}08` }}
                  >
                    <span className="text-2xl" style={{ color: tech.color }}>{tech.icon}</span>
                    <span className="text-sm font-medium" style={{ color: tech.color === '#FFFFFF' ? '#b3b3b3' : tech.color }}>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- PROJECTS SECTION --- */}
          <section id="projects" className="scroll-mt-24">
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-2xl font-bold text-brand-accent flex items-center gap-3">
                <span className="w-8 h-1 bg-brand-accent rounded-full"></span>
                Projects
              </h3>
              <div className="flex items-center gap-4 text-brand-muted">
                <span className="text-sm font-medium hidden sm:inline">View All →</span>
                <div className="flex gap-3">
                   <a href={portfolioData.links.github} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-brand-accent transition-colors hover:scale-110 duration-200" title="GitHub"><FaGithub /></a>
                   <a href={portfolioData.links.itchio} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-brand-accent transition-colors hover:scale-110 duration-200" title="Itch.io"><FaItchIo /></a>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioData.projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </section>

          {/* --- CONTACT ME SECTION --- */}
          <section id="contact-me" className="scroll-mt-24 pb-20">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-brand-accent">
              <span className="w-8 h-1 bg-brand-accent rounded-full"></span>
              Contact Me
            </h3>
            
            <div className="rounded-xl border border-white/5 overflow-hidden shadow-lg p-12 text-center relative bg-[#060340]/30 backdrop-blur-xl group hover:shadow-brand-accent/20 hover:shadow-2xl transition-all duration-300">
               
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-brand-secondary/30 rounded-full blur-[100px] pointer-events-none group-hover:bg-brand-secondary/50 transition-colors duration-500"></div>

               <h4 className="text-2xl font-bold text-white mb-4 relative z-10">Let's Work Together</h4>
               <p className="text-brand-muted max-w-xl mx-auto mb-10 opacity-80 relative z-10">
                 I'm currently available for internships and freelance projects. 
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
                      {copied ? <FaCheck className="text-brand-accent"/> : <FaCopy />}
                    </span>
                  </div>
                  <span className={`text-xs text-brand-accent font-mono transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}>
                    Copied to clipboard!
                  </span>
               </div>

               <div className="flex flex-wrap justify-center gap-8 relative z-10">
                  <a href={`mailto:${portfolioData.email}`} className="text-4xl text-brand-muted hover:text-white hover:scale-110 transition-all duration-300 drop-shadow-lg" title="Send Email"><FaEnvelope /></a>
                  <a href={portfolioData.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-4xl text-brand-muted hover:text-[#0077B5] hover:scale-110 transition-all duration-300 drop-shadow-lg" title="LinkedIn"><FaLinkedin /></a>
                  <a href={portfolioData.links.github} target="_blank" rel="noopener noreferrer" className="text-4xl text-brand-muted hover:text-white hover:scale-110 transition-all duration-300 drop-shadow-lg" title="GitHub"><FaGithub /></a>
                  <a href={portfolioData.links.itchio} target="_blank" rel="noopener noreferrer" className="text-4xl text-brand-muted hover:text-[#FA5C5C] hover:scale-110 transition-all duration-300 drop-shadow-lg" title="Itch.io"><FaItchIo /></a>
                  <a href={portfolioData.links.instagram} target="_blank" rel="noopener noreferrer" className="text-4xl text-brand-muted hover:text-[#E4405F] hover:scale-110 transition-all duration-300 drop-shadow-lg" title="Instagram"><FaInstagram /></a>
               </div>
            </div>
          </section>

        </main>

        <footer className="w-full py-6 text-center text-brand-muted text-sm bg-black/20 backdrop-blur-md border-t border-white/5">
          <p>
            Designed & Built by <span className="text-brand-accent font-bold">{portfolioData.name}</span> © {new Date().getFullYear()}
          </p>
        </footer>

      </div>
    </div>
  );
}

export default App;