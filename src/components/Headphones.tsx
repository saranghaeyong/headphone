import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  HeadbandPart,
  EarCupPart,
  WiredCablePart,
} from './HeadphoneParts';
import {
  assembledPositions,
  playExplosionAnimation,
  playReassembleAnimation,
} from './ExplosionAnimation';
import { CursorMode, ActiveDestination, HeadphoneState } from '../types';

interface HeadphonesProps {
  headphoneState: HeadphoneState;
  onTriggerExplode: () => void;
  onTriggerReset: () => void;
  onAnimationFinished: (nextState: 'assembled' | 'exploded') => void;
  onOpenFilms: () => void;
  onOpenMusic: () => void;
  onSetCursorMode: (mode: CursorMode, text?: string | null) => void;
  activeDestination: ActiveDestination;
  setActiveDestination: (dest: ActiveDestination) => void;
  keyboardRot: { x: number; y: number };
  isMobile: boolean;
}

export const Headphones: React.FC<HeadphonesProps> = ({
  headphoneState,
  onTriggerExplode,
  onAnimationFinished,
  onOpenFilms,
  onOpenMusic,
  onSetCursorMode,
  activeDestination,
  setActiveDestination,
  keyboardRot,
  isMobile,
}) => {
  // Parent group: controls overall rotation, overall scale, and overall floating
  const headphoneRootRef = useRef<THREE.Group>(null);

  // Individual child groups: control explosion / disassembly positions
  const headbandGroupRef = useRef<THREE.Group>(null);
  const leftCupGroupRef = useRef<THREE.Group>(null);
  const rightCupGroupRef = useRef<THREE.Group>(null);
  const cableGroupRef = useRef<THREE.Group>(null);

  // Track previous state to determine whether 'exploding' is exploding outward or returning
  const prevStateRef = useRef<HeadphoneState>(headphoneState);

  // Drag rotation and inertia state on HeadphoneRoot
  const isDragging = useRef(false);
  const pointerDownPos = useRef({ x: 0, y: 0, time: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0.1, y: -0.25 });
  const targetRotation = useRef({ x: 0.1, y: -0.25 });

  // Hover states for individual parts
  const [hoveredPart, setHoveredPart] = useState<'headband' | 'leftCup' | 'rightCup' | 'cable' | null>(null);

  // Trigger GSAP animations ONLY when transitioning to 'exploding'
  useEffect(() => {
    const prevState = prevStateRef.current;
    prevStateRef.current = headphoneState;

    if (headphoneState === 'exploding') {
      const targets = {
        headbandGroup: headbandGroupRef.current,
        leftCupGroup: leftCupGroupRef.current,
        rightCupGroup: rightCupGroupRef.current,
        cableGroup: cableGroupRef.current,
      };

      if (prevState === 'assembled') {
        // Explode outward: assembled -> exploding -> exploded
        playExplosionAnimation(targets, () => {
          onAnimationFinished('exploded');
        });
      } else if (prevState === 'exploded') {
        // Return back: exploded -> exploding -> assembled
        playReassembleAnimation(targets, () => {
          onAnimationFinished('assembled');
        });
      }
    }
  }, [headphoneState, onAnimationFinished]);

  // Inertial rotation and subtle floating in R3F useFrame loop
  useFrame((state, delta) => {
    if (!headphoneRootRef.current) return;

    // Apply keyboard offset
    targetRotation.current.x += keyboardRot.x * delta * 2;
    targetRotation.current.y += keyboardRot.y * delta * 2;

    // Damping towards target rotation
    if (!isDragging.current) {
      targetRotation.current.x += rotationVelocity.current.x;
      targetRotation.current.y += rotationVelocity.current.y;
      rotationVelocity.current.x *= 0.92;
      rotationVelocity.current.y *= 0.92;

      // When exploded, softly attract toward center orientation
      if (headphoneState === 'exploded') {
        targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, 0.04, 0.04);
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

    // Subtle floating animation of the COMPLETE assembled headphone
    const time = state.clock.getElapsedTime();
    const floatY = headphoneState === 'exploded' ? 0 : Math.sin(time * 1.4) * 0.05;
    const floatTilt = headphoneState === 'exploded' ? 0 : Math.cos(time * 0.9) * 0.015;

    headphoneRootRef.current.position.y = floatY;
    headphoneRootRef.current.rotation.x = currentRotation.current.x + floatTilt;
    headphoneRootRef.current.rotation.y = currentRotation.current.y;
    headphoneRootRef.current.rotation.z = floatTilt * 0.5;
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

    // Detect click only if total motion is minimal and duration is short
    if (dragDistance < 7 && duration < 350) {
      if (headphoneState === 'assembled') {
        onTriggerExplode();
      }
    }
  };

  const handleCupClick = (side: 'left' | 'right', e: any) => {
    e.stopPropagation();
    if (headphoneState === 'assembled') {
      onTriggerExplode();
    } else if (headphoneState === 'exploded') {
      if (side === 'left') {
        onOpenFilms();
      } else {
        onOpenMusic();
      }
    }
  };

  return (
    /* HeadphoneRoot: controls overall rotation, overall scale, and overall floating animation */
    <group
      ref={headphoneRootRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      scale={isMobile ? 0.78 : 1.0}
    >
      {/* 
        Child Group: HeadbandGroup
        Initial position: assembledPositions.headband = (0, 0, 0)
      */}
      <group
        ref={headbandGroupRef}
        position={[
          assembledPositions.headband.x,
          assembledPositions.headband.y,
          assembledPositions.headband.z,
        ]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('headband');
          if (headphoneState === 'assembled') {
            onSetCursorMode('click', 'DISASSEMBLE');
          } else if (headphoneState === 'exploded') {
            onSetCursorMode('rotate', 'ROTATE');
          }
        }}
        onPointerOut={() => {
          setHoveredPart(null);
          onSetCursorMode('default');
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (headphoneState === 'assembled') onTriggerExplode();
        }}
      >
        <HeadbandPart isHovered={hoveredPart === 'headband'} />
      </group>

      {/* 
        Child Group: LeftCupGroup (FILMS Destination)
        Initial position: assembledPositions.leftCup = (0, 0, 0)
      */}
      <group
        ref={leftCupGroupRef}
        position={[
          assembledPositions.leftCup.x,
          assembledPositions.leftCup.y,
          assembledPositions.leftCup.z,
        ]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('leftCup');
          if (headphoneState === 'assembled') {
            onSetCursorMode('click', 'DISASSEMBLE');
          } else if (headphoneState === 'exploded') {
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
          side="left"
          isHovered={hoveredPart === 'leftCup' || activeDestination === 'films'}
        />
      </group>

      {/* 
        Child Group: RightCupGroup (MUSIC Destination)
        Initial position: assembledPositions.rightCup = (0, 0, 0)
      */}
      <group
        ref={rightCupGroupRef}
        position={[
          assembledPositions.rightCup.x,
          assembledPositions.rightCup.y,
          assembledPositions.rightCup.z,
        ]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('rightCup');
          if (headphoneState === 'assembled') {
            onSetCursorMode('click', 'DISASSEMBLE');
          } else if (headphoneState === 'exploded') {
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
          side="right"
          isHovered={hoveredPart === 'rightCup' || activeDestination === 'music'}
        />
      </group>

      {/* 
        Child Group: CableGroup
        Initial position: assembledPositions.cable = (0, 0, 0)
      */}
      <group
        ref={cableGroupRef}
        position={[
          assembledPositions.cable.x,
          assembledPositions.cable.y,
          assembledPositions.cable.z,
        ]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('cable');
          if (headphoneState === 'assembled') {
            onSetCursorMode('click', 'DISASSEMBLE');
          } else if (headphoneState === 'exploded') {
            onSetCursorMode('rotate', 'ROTATE');
          }
        }}
        onPointerOut={() => {
          setHoveredPart(null);
          onSetCursorMode('default');
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (headphoneState === 'assembled') onTriggerExplode();
        }}
      >
        <WiredCablePart isHovered={hoveredPart === 'cable'} />
      </group>
    </group>
  );
};
