import { gsap } from 'gsap';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export interface ExplosionTargets {
  headbandRef: React.RefObject<THREE.Group | null>;
  leftCupRef: React.RefObject<THREE.Group | null>;
  rightCupRef: React.RefObject<THREE.Group | null>;
  cableRef: React.RefObject<THREE.Group | null>;
}

export interface ExplosionConfig {
  isExploded: boolean;
  duration?: number;
  prefersReducedMotion?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
}

// Initial resting positions (assembled)
export const REST_TRANSFORMS = {
  headband: {
    x: 0,
    y: 1.15,
    z: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    scale: 1,
  },
  leftCup: {
    x: -1.35,
    y: 0,
    z: 0,
    rotX: 0,
    rotY: 0.05,
    rotZ: 0.08,
    scale: 1,
  },
  rightCup: {
    x: 1.35,
    y: 0,
    z: 0,
    rotX: 0,
    rotY: -0.05,
    rotZ: -0.08,
    scale: 1,
  },
  cable: {
    x: -1.35,
    y: -0.65,
    z: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    scale: 1,
  },
};

// Exploded positions (disassembled into navigation destinations)
export const EXPLODED_TRANSFORMS = {
  headband: {
    x: 0,
    y: 2.35,
    z: -0.4,
    rotX: -0.25,
    rotY: 0,
    rotZ: 0,
    scale: 0.95,
  },
  leftCup: {
    x: -2.85,
    y: 0.1,
    z: 0.6,
    rotX: 0.05,
    rotY: 0.42,
    rotZ: 0.12,
    scale: 1.12,
  },
  rightCup: {
    x: 2.85,
    y: 0.1,
    z: 0.6,
    rotX: 0.05,
    rotY: -0.42,
    rotZ: -0.12,
    scale: 1.12,
  },
  cable: {
    x: -2.85,
    y: -1.8,
    z: 0.3,
    rotX: 0.2,
    rotY: 0.1,
    rotZ: 0.1,
    scale: 0.9,
  },
};

/**
 * Custom hook to drive the 3D explosion disassembly and reassembly via GSAP
 */
export function useExplosionAnimation(
  targets: ExplosionTargets,
  {
    isExploded,
    duration = 0.8,
    prefersReducedMotion = false,
    onStart,
    onComplete,
  }: ExplosionConfig
) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const { headbandRef, leftCupRef, rightCupRef, cableRef } = targets;

    if (!headbandRef.current || !leftCupRef.current || !rightCupRef.current || !cableRef.current) {
      return;
    }

    if (tlRef.current) {
      tlRef.current.kill();
    }

    const animDuration = prefersReducedMotion ? 0.05 : duration;
    const ease = isExploded ? 'power3.out' : 'power3.inOut';

    const targetPos = isExploded ? EXPLODED_TRANSFORMS : REST_TRANSFORMS;

    const tl = gsap.timeline({
      onStart: () => {
        onStart?.();
      },
      onComplete: () => {
        onComplete?.();
      },
    });

    tlRef.current = tl;

    // Headband
    tl.to(
      headbandRef.current.position,
      {
        x: targetPos.headband.x,
        y: targetPos.headband.y,
        z: targetPos.headband.z,
        duration: animDuration,
        ease,
      },
      0
    );
    tl.to(
      headbandRef.current.rotation,
      {
        x: targetPos.headband.rotX,
        y: targetPos.headband.rotY,
        z: targetPos.headband.rotZ,
        duration: animDuration,
        ease,
      },
      0
    );
    tl.to(
      headbandRef.current.scale,
      {
        x: targetPos.headband.scale,
        y: targetPos.headband.scale,
        z: targetPos.headband.scale,
        duration: animDuration,
        ease,
      },
      0
    );

    // Left Cup (FILMS)
    tl.to(
      leftCupRef.current.position,
      {
        x: targetPos.leftCup.x,
        y: targetPos.leftCup.y,
        z: targetPos.leftCup.z,
        duration: animDuration,
        ease,
      },
      0
    );
    tl.to(
      leftCupRef.current.rotation,
      {
        x: targetPos.leftCup.rotX,
        y: targetPos.leftCup.rotY,
        z: targetPos.leftCup.rotZ,
        duration: animDuration,
        ease,
      },
      0
    );
    tl.to(
      leftCupRef.current.scale,
      {
        x: targetPos.leftCup.scale,
        y: targetPos.leftCup.scale,
        z: targetPos.leftCup.scale,
        duration: animDuration,
        ease,
      },
      0
    );

    // Right Cup (MUSIC)
    tl.to(
      rightCupRef.current.position,
      {
        x: targetPos.rightCup.x,
        y: targetPos.rightCup.y,
        z: targetPos.rightCup.z,
        duration: animDuration,
        ease,
      },
      0
    );
    tl.to(
      rightCupRef.current.rotation,
      {
        x: targetPos.rightCup.rotX,
        y: targetPos.rightCup.rotY,
        z: targetPos.rightCup.rotZ,
        duration: animDuration,
        ease,
      },
      0
    );
    tl.to(
      rightCupRef.current.scale,
      {
        x: targetPos.rightCup.scale,
        y: targetPos.rightCup.scale,
        z: targetPos.rightCup.scale,
        duration: animDuration,
        ease,
      },
      0
    );

    // Cable
    tl.to(
      cableRef.current.position,
      {
        x: targetPos.cable.x,
        y: targetPos.cable.y,
        z: targetPos.cable.z,
        duration: animDuration,
        ease,
      },
      0
    );
    tl.to(
      cableRef.current.rotation,
      {
        x: targetPos.cable.rotX,
        y: targetPos.cable.rotY,
        z: targetPos.cable.rotZ,
        duration: animDuration,
        ease,
      },
      0
    );
    tl.to(
      cableRef.current.scale,
      {
        x: targetPos.cable.scale,
        y: targetPos.cable.scale,
        z: targetPos.cable.scale,
        duration: animDuration,
        ease,
      },
      0
    );

    return () => {
      tl.kill();
    };
  }, [isExploded, duration, prefersReducedMotion, targets, onStart, onComplete]);

  return tlRef;
}
