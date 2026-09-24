import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  HeadbandPart,
  EarCupPart,
  WiredCablePart,
} from './HeadphoneParts';
import {
  useExplosionAnimation,
  REST_TRANSFORMS,
} from './ExplosionAnimation';
import { CursorMode, ActiveDestination } from '../types';

interface HeadphonesProps {
  isExploded: boolean;
  onToggleExplode: () => void;
  onOpenFilms: () => void;
  onOpenMusic: () => void;
  onSetCursorMode: (mode: CursorMode, text?: string | null) => void;
  activeDestination: ActiveDestination;
  setActiveDestination: (dest: ActiveDestination) => void;
  keyboardRot: { x: number; y: number };
  isMobile: boolean;
}

export const Headphones: React.FC<HeadphonesProps> = ({
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
  const rootGroupRef = useRef<THREE.Group>(null);
  const headbandRef = useRef<THREE.Group>(null);
  const leftCupRef = useRef<THREE.Group>(null);
  const rightCupRef = useRef<THREE.Group>(null);
  const cableRef = useRef<THREE.Group>(null);

  // Drag rotation and inertia state
  const isDragging = useRef(false);
  const pointerDownPos = useRef({ x: 0, y: 0, time: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0.1, y: -0.25 });
  const targetRotation = useRef({ x: 0.1, y: -0.25 });

  // Hover states for individual parts
  const [hoveredPart, setHoveredPart] = useState<'headband' | 'leftCup' | 'rightCup' | 'cable' | null>(null);

  // Hook up GSAP explosion timeline
  useExplosionAnimation(
    {
      headbandRef,
      leftCupRef,
      rightCupRef,
      cableRef,
    },
    {
      isExploded,
      duration: 0.8,
    }
  );

  // Inertial rotation and subtle floating in R3F useFrame loop
  useFrame((state, delta) => {
    if (!rootGroupRef.current) return;

    // Apply keyboard offset
    targetRotation.current.x += keyboardRot.x * delta * 2;
    targetRotation.current.y += keyboardRot.y * delta * 2;

    // Damping towards target rotation
    if (!isDragging.current) {
      // Natural inertia damping
      targetRotation.current.x += rotationVelocity.current.x;
      targetRotation.current.y += rotationVelocity.current.y;
      rotationVelocity.current.x *= 0.92;
      rotationVelocity.current.y *= 0.92;

      // When exploded, softly attract toward center orientation so cards are aligned
      if (isExploded) {
        targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, 0.05, 0.04);
        targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, 0, 0.04);
      }
    }

    // Clamp vertical pitch rotation
    targetRotation.current.x = THREE.MathUtils.clamp(
      targetRotation.current.x,
      -Math.PI / 3.2,
      Math.PI / 3.2
    );

    // Smooth lerp to current
    currentRotation.current.x = THREE.MathUtils.lerp(
      currentRotation.current.x,
      targetRotation.current.x,
      0.12
    );
    currentRotation.current.y = THREE.MathUtils.lerp(
      currentRotation.current.y,
      targetRotation.current.y,
      0.12
    );

    // Subtle breathing / floating animation when assembled
    const time = state.clock.getElapsedTime();
    const floatY = isExploded ? 0 : Math.sin(time * 1.4) * 0.06;
    const floatTilt = isExploded ? 0 : Math.cos(time * 0.9) * 0.02;

    rootGroupRef.current.position.y = floatY;
    rootGroupRef.current.rotation.x = currentRotation.current.x + floatTilt;
    rootGroupRef.current.rotation.y = currentRotation.current.y;
    rootGroupRef.current.rotation.z = floatTilt * 0.5;
  });

  // Pointer drag & click handling
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    pointerDownPos.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    rotationVelocity.current = { x: 0, y: 0 };
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - pointerDownPos.current.x;
    const deltaY = e.clientY - pointerDownPos.current.y;

    pointerDownPos.current.x = e.clientX;
    pointerDownPos.current.y = e.clientY;

    const sensitivity = isMobile ? 0.007 : 0.005;

    targetRotation.current.y += deltaX * sensitivity;
    targetRotation.current.x += deltaY * sensitivity;

    rotationVelocity.current.y = deltaX * sensitivity * 0.4;
    rotationVelocity.current.x = deltaY * sensitivity * 0.4;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    const dragDistance = Math.hypot(
      e.clientX - pointerDownPos.current.x,
      e.clientY - pointerDownPos.current.y
    );
    const duration = Date.now() - pointerDownPos.current.time;

    // Fast click with minimal motion = trigger action!
    if (dragDistance < 10 && duration < 350) {
      if (!isExploded) {
        onToggleExplode();
      }
    }
  };

  const handleCupClick = (side: 'left' | 'right', e: any) => {
    e.stopPropagation();
    if (!isExploded) {
      onToggleExplode();
    } else {
      if (side === 'left') {
        onOpenFilms();
      } else {
        onOpenMusic();
      }
    }
  };

  return (
    <group
      ref={rootGroupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      scale={isMobile ? 0.78 : 1.0}
    >
      {/* Headband Part */}
      <group
        position={[
          REST_TRANSFORMS.headband.x,
          REST_TRANSFORMS.headband.y,
          REST_TRANSFORMS.headband.z,
        ]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('headband');
          if (!isExploded) {
            onSetCursorMode('click', 'DISASSEMBLE');
          } else {
            onSetCursorMode('rotate', 'ROTATE');
          }
        }}
        onPointerOut={() => {
          setHoveredPart(null);
          onSetCursorMode('default');
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!isExploded) onToggleExplode();
        }}
      >
        <HeadbandPart
          ref={headbandRef}
          isHovered={hoveredPart === 'headband'}
        />
      </group>

      {/* Left Ear Cup Part (FILMS) */}
      <group
        position={[
          REST_TRANSFORMS.leftCup.x,
          REST_TRANSFORMS.leftCup.y,
          REST_TRANSFORMS.leftCup.z,
        ]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('leftCup');
          if (!isExploded) {
            onSetCursorMode('click', 'DISASSEMBLE');
          } else {
            onSetCursorMode('open', 'OPEN FILMS');
            setActiveDestination('films');
          }
        }}
        onPointerOut={() => {
          setHoveredPart(null);
          onSetCursorMode('default');
          if (activeDestination === 'films') {
            setActiveDestination(null);
          }
        }}
        onClick={(e) => handleCupClick('left', e)}
      >
        <EarCupPart
          ref={leftCupRef}
          side="left"
          isHovered={hoveredPart === 'leftCup' || activeDestination === 'films'}
        />
      </group>

      {/* Right Ear Cup Part (MUSIC) */}
      <group
        position={[
          REST_TRANSFORMS.rightCup.x,
          REST_TRANSFORMS.rightCup.y,
          REST_TRANSFORMS.rightCup.z,
        ]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('rightCup');
          if (!isExploded) {
            onSetCursorMode('click', 'DISASSEMBLE');
          } else {
            onSetCursorMode('open', 'OPEN MUSIC');
            setActiveDestination('music');
          }
        }}
        onPointerOut={() => {
          setHoveredPart(null);
          onSetCursorMode('default');
          if (activeDestination === 'music') {
            setActiveDestination(null);
          }
        }}
        onClick={(e) => handleCupClick('right', e)}
      >
        <EarCupPart
          ref={rightCupRef}
          side="right"
          isHovered={hoveredPart === 'rightCup' || activeDestination === 'music'}
        />
      </group>

      {/* Wired Audio Cable Part */}
      <group
        position={[
          REST_TRANSFORMS.cable.x,
          REST_TRANSFORMS.cable.y,
          REST_TRANSFORMS.cable.z,
        ]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('cable');
          if (!isExploded) {
            onSetCursorMode('click', 'DISASSEMBLE');
          } else {
            onSetCursorMode('rotate', 'ROTATE');
          }
        }}
        onPointerOut={() => {
          setHoveredPart(null);
          onSetCursorMode('default');
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!isExploded) onToggleExplode();
        }}
      >
        <WiredCablePart
          ref={cableRef}
          isHovered={hoveredPart === 'cable'}
        />
      </group>
    </group>
  );
};
