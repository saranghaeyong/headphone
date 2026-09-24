import React from 'react';
import { FilmDestination } from './FilmDestination';
import { MusicDestination } from './MusicDestination';
import { ActiveDestination, CursorMode } from '../types';

interface NavigationObjectProps {
  isExploded: boolean;
  activeDestination: ActiveDestination;
  setActiveDestination: (dest: ActiveDestination) => void;
  onSetCursorMode: (mode: CursorMode, text?: string | null) => void;
  onOpenFilms: () => void;
  onOpenMusic: () => void;
  isMobile: boolean;
}

export const NavigationObject: React.FC<NavigationObjectProps> = ({
  isExploded,
  activeDestination,
  setActiveDestination,
  onSetCursorMode,
  onOpenFilms,
  onOpenMusic,
  isMobile,
}) => {
  // Mobile Tab selector state when exploded
  const [mobileTab, setMobileTab] = React.useState<'films' | 'music'>('films');

  return (
    <div
      aria-hidden={!isExploded}
      className={`absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-8 lg:p-12 transition-opacity duration-500 ${
        isExploded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Desktop / Large Screen Layout: Flanking Ear Cups */}
      <div className="hidden md:flex w-full h-full items-center justify-between">
        {/* Left Ear Cup = FILMS */}
        <div className="w-[340px] lg:w-[380px] pointer-events-auto">
          <FilmDestination
            isExploded={isExploded}
            isActive={activeDestination === 'films'}
            onHover={(active) => setActiveDestination(active ? 'films' : null)}
            onSetCursorMode={onSetCursorMode}
            onOpen={onOpenFilms}
          />
        </div>

        {/* Right Ear Cup = MUSIC */}
        <div className="w-[340px] lg:w-[380px] pointer-events-auto">
          <MusicDestination
            isExploded={isExploded}
            isActive={activeDestination === 'music'}
            onHover={(active) => setActiveDestination(active ? 'music' : null)}
            onSetCursorMode={onSetCursorMode}
            onOpen={onOpenMusic}
          />
        </div>
      </div>

      {/* Mobile Layout: Segmented Viewport bottom container */}
      <div className="md:hidden flex flex-col justify-end w-full h-full pb-4">
        {/* Mobile Tab switcher (Functional interactive control) */}
        <div className="pointer-events-auto w-full max-w-sm mx-auto mb-3 flex items-center justify-center p-1 bg-white/80 backdrop-blur-md rounded-xl border border-[#1c1b18]/10 shadow-sm">
          <button
            type="button"
            onClick={() => {
              setMobileTab('films');
              setActiveDestination('films');
            }}
            className={`flex-1 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors ${
              mobileTab === 'films'
                ? 'bg-[#1c1b18] text-white shadow-sm'
                : 'text-[#6d6961] hover:text-[#1c1b18]'
            }`}
          >
            Left Cup: Films
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileTab('music');
              setActiveDestination('music');
            }}
            className={`flex-1 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors ${
              mobileTab === 'music'
                ? 'bg-[#1c1b18] text-white shadow-sm'
                : 'text-[#6d6961] hover:text-[#1c1b18]'
            }`}
          >
            Right Cup: Music
          </button>
        </div>

        {/* Mobile active destination card */}
        <div className="pointer-events-auto w-full max-w-sm mx-auto max-h-[50vh] overflow-y-auto">
          {mobileTab === 'films' ? (
            <FilmDestination
              isExploded={isExploded}
              isActive={true}
              onHover={() => {}}
              onSetCursorMode={onSetCursorMode}
              onOpen={onOpenFilms}
            />
          ) : (
            <MusicDestination
              isExploded={isExploded}
              isActive={true}
              onHover={() => {}}
              onSetCursorMode={onSetCursorMode}
              onOpen={onOpenMusic}
            />
          )}
        </div>
      </div>
    </div>
  );
};
