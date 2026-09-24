import React, { useState } from 'react';
import { RotateCcw, Volume2, VolumeX, Info, X } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio';
import { CursorMode, HeadphoneState } from '../types';
import { acousticEngine } from '../utils/acousticEngine';

interface UIProps {
  headphoneState: HeadphoneState;
  onReset: () => void;
  onSetCursorMode: (mode: CursorMode, text?: string | null) => void;
  onOpenFilms: () => void;
  onOpenMusic: () => void;
}

export const UI: React.FC<UIProps> = ({
  headphoneState,
  onReset,
  onSetCursorMode,
  onOpenFilms,
  onOpenMusic,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isMuted, setIsMuted] = useState(acousticEngine.getIsMuted());
  const artist = PORTFOLIO_CONFIG.artist;
  const isExploded = headphoneState === 'exploded';

  const handleToggleSound = () => {
    const nextMuted = acousticEngine.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      acousticEngine.playMicroTick();
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 sm:p-8 lg:p-10">
      {/* 
        TOP BAR CONTRACT:
        Zone 1: Single text element wordmark
        Zone 2: Clean unboxed metadata / navigation status
        Zone 3: 1-2 primary functional actions
      */}
      <header className="w-full flex items-center justify-between pb-4 pointer-events-auto border-b border-[#1c1b18]/8">
        {/* Zone 1: Brand wordmark */}
        <button
          type="button"
          onClick={() => {
            if (headphoneState === 'exploded') onReset();
          }}
          className="text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c1b18]"
          aria-label="SARANG Portfolio — Click to reset scene"
          onMouseEnter={() => {
            if (headphoneState === 'exploded') onSetCursorMode('reconstruct', 'RESET');
          }}
          onMouseLeave={() => onSetCursorMode('default')}
        >
          <span className="font-serif-title text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#1c1b18] uppercase group-hover:opacity-75 transition-opacity">
            {artist.name}
          </span>
        </button>

        {/* Zone 2: Navigation state / metadata */}
        <div className="hidden sm:flex items-center gap-3 text-xs tracking-widest uppercase text-[#726e66] font-medium">
          <span>{artist.title}</span>
          <span aria-hidden="true" className="text-[#c2beb4]">·</span>
          <span>{headphoneState === 'exploded' ? 'EXPLODED VIEW' : 'ASSEMBLED MODEL'}</span>
        </div>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Destination Links (when exploded) */}
          {headphoneState === 'exploded' && (
            <>
              <button
                type="button"
                onClick={onOpenFilms}
                onMouseEnter={() => onSetCursorMode('open', 'LETTERBOXD')}
                onMouseLeave={() => onSetCursorMode('default')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-[#3f3c36] hover:text-[#1c1b18] hover:bg-[#1c1b18]/5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#1c1b18]"
              >
                <span>[F] Films</span>
              </button>

              <button
                type="button"
                onClick={onOpenMusic}
                onMouseEnter={() => onSetCursorMode('open', 'INSTAGRAM')}
                onMouseLeave={() => onSetCursorMode('default')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-[#3f3c36] hover:text-[#1c1b18] hover:bg-[#1c1b18]/5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#1c1b18]"
              >
                <span>[M] Music</span>
              </button>
            </>
          )}

          {/* Reset Action (only available when exploded) */}
          {headphoneState === 'exploded' && (
            <button
              type="button"
              onClick={onReset}
              onMouseEnter={() => onSetCursorMode('reconstruct', 'RESET')}
              onMouseLeave={() => onSetCursorMode('default')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest uppercase bg-[#1c1b18] text-white hover:bg-[#33312c] rounded-lg transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1c1b18]"
              aria-label="Reconstruct headphone model (Escape key)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reconstruct [Esc]</span>
            </button>
          )}

          {/* Sound Mute / Unmute Button */}
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Unmute acoustic cues' : 'Mute acoustic cues'}
            className="p-2 text-[#5a564f] hover:text-[#1c1b18] hover:bg-[#1c1b18]/5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#1c1b18]"
            onMouseEnter={() => onSetCursorMode('open', isMuted ? 'UNMUTE' : 'MUTE')}
            onMouseLeave={() => onSetCursorMode('default')}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-[#a39e94]" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* About / Info Modal Button */}
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            aria-label="About Sarang & Exhibition Information"
            className="p-2 text-[#5a564f] hover:text-[#1c1b18] hover:bg-[#1c1b18]/5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#1c1b18]"
            onMouseEnter={() => onSetCursorMode('open', 'ABOUT')}
            onMouseLeave={() => onSetCursorMode('default')}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 
        INITIAL HERO WATERMARK & INSTRUCTIONS:
        Visible prominently on initial load when assembled.
      */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-700 ease-out select-none ${
          isExploded
            ? 'opacity-0 scale-95 pointer-events-none'
            : 'opacity-100 scale-100'
        }`}
      >
        {/* Minimal instruction kicker */}
        <div className="absolute bottom-28 sm:bottom-24 flex flex-col items-center text-center space-y-2 pointer-events-auto">
          <p className="text-xs sm:text-sm font-medium tracking-[0.25em] text-[#33312c] uppercase">
            Drag to Rotate · Click Headphone to Disassemble
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#78746c] font-mono">
            <span>Left Cup: Films</span>
            <span aria-hidden="true">/</span>
            <span>Right Cup: Music</span>
          </div>
        </div>
      </div>

      {/* 
        BOTTOM UTILITY BAR:
        Keyboard shortcuts and tactile audio hints
      */}
      <footer className="w-full flex flex-col sm:flex-row items-center justify-between pt-4 pointer-events-auto border-t border-[#1c1b18]/8 text-[11px] text-[#726e66] gap-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 font-medium text-[#2d2a26] hover:opacity-75 transition-opacity"
            aria-label={isMuted ? 'Acoustic cues muted - click to enable' : 'Acoustic cues active - click to mute'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-[#a39e94]" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#726e66]" />
            )}
            <span>Acoustic Interface ({isMuted ? 'Muted' : 'Active'})</span>
          </button>
          <span aria-hidden="true" className="text-[#c2beb4]">·</span>
          <span>Complete 3D Audio Model</span>
        </div>

        {/* Keyboard shortcut guide */}
        <div className="flex items-center gap-2 text-[10px] tracking-wider uppercase font-mono text-[#827d73]">
          <span className="hidden md:inline">Rotate: [Arrow Keys]</span>
          <span className="hidden md:inline" aria-hidden="true">·</span>
          <span>{headphoneState === 'exploded' ? 'Reconstruct: [Esc]' : 'Disassemble: [Click / Space]'}</span>
          {headphoneState === 'exploded' && (
            <>
              <span aria-hidden="true">·</span>
              <span>[F] Films · [M] Music</span>
            </>
          )}
        </div>
      </footer>

      {/* Info / Curatorial Modal */}
      {showInfoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1b18]/30 backdrop-blur-sm pointer-events-auto"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="w-full max-w-lg p-7 sm:p-8 bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-[#1c1b18]/10 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#88837a] font-semibold">
                  Curatorial Statement
                </span>
                <h3 id="info-modal-title" className="font-serif-title text-2xl text-[#1c1b18] mt-1">
                  SARANG · 2026
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="p-1 text-[#666] hover:text-[#111] rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#1c1b18]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-[#4d4942] leading-relaxed">
              {artist.about}
            </p>

            <div className="space-y-2 pt-2 border-t border-[#1c1b18]/8 text-xs text-[#524e47]">
              <div className="flex justify-between py-1">
                <span className="text-[#88837a]">Left Navigation:</span>
                <span className="font-medium text-[#1c1b18]">Films (Saranghaeyo on Letterboxd)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#88837a]">Right Navigation:</span>
                <span className="font-medium text-[#1c1b18]">Music (Playlist BGM on Instagram)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#88837a]">Physical Object:</span>
                <span className="font-medium text-[#1c1b18]">Complete White Wired Headphone</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="w-full py-3 bg-[#1c1b18] text-white text-xs font-semibold tracking-widest uppercase rounded-xl hover:bg-[#33312c] transition-colors"
              >
                Return to Headphone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

