import React from 'react';
import { PORTFOLIO_CONFIG } from '../config/portfolio';
import { ArrowUpRight } from 'lucide-react';
import { CursorMode } from '../types';

interface FilmDestinationProps {
  isExploded: boolean;
  isActive: boolean;
  onHover: (active: boolean) => void;
  onSetCursorMode: (mode: CursorMode, text?: string | null) => void;
  onOpen: () => void;
}

export const FilmDestination: React.FC<FilmDestinationProps> = ({
  isExploded,
  isActive,
  onHover,
  onSetCursorMode,
  onOpen,
}) => {
  const filmData = PORTFOLIO_CONFIG.destinations.films;

  return (
    <article
      aria-label="Films Destination — Left Ear Cup"
      className={`transition-all duration-700 ease-out ${
        isExploded
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
      onMouseEnter={() => {
        onHover(true);
        onSetCursorMode('open', 'OPEN LETTERBOXD');
      }}
      onMouseLeave={() => {
        onHover(false);
        onSetCursorMode('default');
      }}
    >
      {/* Light, minimal, editorial card with off-white background and soft grey shadow */}
      <div
        className={`w-full max-w-[340px] sm:max-w-[380px] p-6 sm:p-7 rounded-2xl transition-all duration-300 ${
          isActive
            ? 'bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#1c1b18]/15 -translate-y-1'
            : 'bg-white/85 shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-[#1c1b18]/8 backdrop-blur-md'
        }`}
      >
        {/* Section kicker & origin indicator */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[#78746c] font-medium pb-4 border-b border-[#1c1b18]/6">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#1c1b18]" />
            <span>Left Ear Cup</span>
          </div>
          <span className="font-mono text-[10px] text-[#9a958b]">Press [F]</span>
        </div>

        {/* Primary Required Hierarchy:
            FILMS
            SARANGHAEYO
            LETTERBOXD
        */}
        <div className="pt-5 space-y-1.5">
          <h2 className="font-serif-title text-3xl sm:text-4xl tracking-tight text-[#1c1b18] font-normal leading-none uppercase">
            {filmData.title}
          </h2>
          <div className="font-display text-base sm:text-lg font-medium tracking-wide text-[#3a3733] uppercase">
            {filmData.subtitle}
          </div>
          <div className="text-xs font-semibold tracking-widest text-[#78746c] uppercase">
            {filmData.platform}
          </div>
        </div>

        {/* Curatorial description */}
        <p className="mt-4 text-xs sm:text-sm text-[#57534c] leading-relaxed font-normal">
          {filmData.description}
        </p>

        {/* Editorial tags (Zero-pill discipline: unboxed clean text with typographic separators) */}
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#78746c]">
          {filmData.tags.map((tag, idx) => (
            <React.Fragment key={tag}>
              <span>{tag}</span>
              {idx < filmData.tags.length - 1 && <span aria-hidden="true" className="text-[#bbb6ab]">·</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Featured diary selections */}
        <div className="mt-5 pt-4 border-t border-[#1c1b18]/6 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-[#9a958b] font-medium">
            Recent Log Highlights
          </div>
          <div className="space-y-1.5">
            {filmData.featuredWorks.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-baseline justify-between text-xs">
                <span className="font-medium text-[#2d2a26] truncate max-w-[200px]">
                  {item.title}
                </span>
                <span className="text-[11px] text-[#78746c] shrink-0 font-mono">
                  {item.year}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary CTA Button: OPEN LETTERBOXD */}
        <div className="mt-6 pt-2">
          <a
            href={filmData.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="group relative flex w-full items-center justify-between px-5 py-3.5 bg-[#1c1b18] hover:bg-[#32302b] text-white rounded-xl transition-all duration-200 shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1c1b18]"
            aria-label="Open Saranghaeyo on Letterboxd in a new tab"
          >
            <span className="text-xs font-semibold tracking-widest uppercase">
              {filmData.buttonLabel}
            </span>
            <ArrowUpRight className="w-4 h-4 text-white/80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
