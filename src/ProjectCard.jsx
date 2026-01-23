// src/ProjectCard.jsx
import React from "react";
import Tilt from "react-parallax-tilt";

const ProjectCard = ({ project }) => {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Tilt
        tiltMaxAngleX={3}
        tiltMaxAngleY={3}
        perspective={1000}
        scale={1.02}
        transitionSpeed={400}
        gyroscope={false} // OPTİMİZASYON: Mobilde sensör kullanımını kapatır (Pil ve Performans dostu)
        className="h-full"
      >
        {/* KART DIŞ ÇERÇEVE */}
        {/* 'will-change-transform' tarayıcıya bu elementin hareket edeceğini söyler, GPU hazırlığı yapar. */}
        <div className="rounded-xl border border-white/5 overflow-hidden shadow-lg h-full flex flex-col group relative hover:shadow-2xl hover:shadow-brand-accent/20 transition-all bg-[#030224ff]/30 will-change-transform">
          {/* Parlama Efekti */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>

          {/* --- RESİM ALANI --- */}
          <div className="h-96 overflow-hidden relative border-b border-white/5 shrink-0">
            <img
              src={project.image}
              alt={project.title}
              loading="lazy" // OPTİMİZASYON: Ekrana girmeden yükleme yapma
              decoding="async" // OPTİMİZASYON: Resim işlenirken sayfayı dondurma
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-xs font-bold border border-white/10 text-white z-20">
              {project.type === "game" ? "Game" : "Web App"}
            </div>
          </div>

          {/* --- İÇERİK ALANI --- */}
          {/* Not: backdrop-blur-xl mobilde performansı düşürebilir. Eğer kasarsa 'backdrop-blur-none md:backdrop-blur-xl' yapabilirsiniz. */}
          <div className="p-8 flex flex-col flex-grow relative z-20 bg-[#06042d]/40 backdrop-blur-xl border-t border-white/5">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-2xl font-bold text-white group-hover:text-brand-accent transition-colors drop-shadow-sm">
                {project.title}
              </h4>
            </div>

            <p className="text-brand-muted text-sm mb-6 leading-relaxed opacity-90 flex-grow drop-shadow-sm">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-mono text-brand-muted border border-white/10 px-2 py-1 rounded bg-black/40 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Tilt>
    </a>
  );
};

export default ProjectCard;
