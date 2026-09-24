import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, PerspectiveCamera, Environment } from '@react-three/drei';
import { Headphones } from './Headphones';
import { CursorMode, ActiveDestination } from '../types';

interface SceneProps {
  isExploded: boolean;
  onToggleExplode: () => void;
  onOpenFilms: () => void;
  onOpenMusic: () => void;
  onSetCursorMode: (mode: CursorMode, text?: string | null) => void;
  activeDestination: ActiveDestination;
  setActiveDestination: (dest: ActiveDestination) => void;
  keyboardRot: { x: number; y: number };
  isMobile: boolean;
  onModelLoaded?: () => void;
}

export const Scene: React.FC<SceneProps> = ({
  isExploded,
  onToggleExplode,
  onOpenFilms,
  onOpenMusic,
  onSetCursorMode,
  activeDestination,
  setActiveDestination,
  keyboardRot,
  isMobile,
}) => {
  return (
    <div
      className="w-full h-full absolute inset-0 select-none touch-none"
      onPointerLeave={() => onSetCursorMode('default')}
    >
      <Canvas
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 0, isMobile ? 7.2 : 6.2]}
          fov={isMobile ? 48 : 40}
        />

        {/* Ambient & Three-Point Studio Lighting for White Materials */}
        <ambientLight intensity={1.1} color="#ffffff" />
        
        {/* Key Directional Light */}
        <directionalLight
          position={[4, 8, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={25}
          shadow-bias={-0.0001}
          color="#fffdfa"
        />

        {/* Soft Cool Fill Light */}
        <directionalLight
          position={[-5, 2, -3]}
          intensity={0.8}
          color="#f4f6fa"
        />

        {/* Rim / Backlight for separation */}
        <directionalLight
          position={[0, -4, -6]}
          intensity={1.2}
          color="#ffffff"
        />

        {/* Studio top fill */}
        <directionalLight
          position={[0, 6, 0]}
          intensity={0.6}
          color="#faf8f5"
        />

        {/* Subtle environment reflection map */}
        <Environment preset="studio" environmentIntensity={0.35} />

        <Suspense fallback={null}>
          <Headphones
            isExploded={isExploded}
            onToggleExplode={onToggleExplode}
            onOpenFilms={onOpenFilms}
            onOpenMusic={onOpenMusic}
            onSetCursorMode={onSetCursorMode}
            activeDestination={activeDestination}
            setActiveDestination={setActiveDestination}
            keyboardRot={keyboardRot}
            isMobile={isMobile}
          />

          {/* Soft natural studio shadow plane underneath the headphone */}
          <ContactShadows
            position={[0, isExploded ? -2.7 : -2.3, 0]}
            opacity={0.32}
            scale={11}
            blur={2.4}
            far={4.5}
            color="#686358"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
