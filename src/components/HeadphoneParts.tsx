/**
 * HEADPHONE 3D PARTS & PROCEDURAL MESH DEFINITIONS
 * 
 * --------------------------------------------------------------------------------
 * CUSTOM GLB MODEL REPLACEMENT GUIDE:
 * If you have a custom 3D headphone .glb file:
 * 1. Place your .glb file in the `/public` folder (e.g. `/public/headphone.glb`).
 * 2. In `/src/config/portfolio.ts`, change `PORTFOLIO_CONFIG.headphoneModel.useCustomGLB = true`
 *    and set `PORTFOLIO_CONFIG.headphoneModel.glbPath = '/headphone.glb'`.
 * 3. Make sure the GLB contains objects named or assigned to:
 *    - "Headband"
 *    - "LeftCup"
 *    - "RightCup"
 *    - "Cable"
 *    or the component will render your root GLB mesh directly!
 * --------------------------------------------------------------------------------
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';

// Premium Light Editorial Material finishes
const MATTE_WHITE = {
  color: '#f6f5f1',
  roughness: 0.38,
  metalness: 0.04,
  clearcoat: 0.25,
  clearcoatRoughness: 0.2,
};

const BRUSHED_ALUMINUM = {
  color: '#e4e6eb',
  roughness: 0.22,
  metalness: 0.88,
};

const LEATHER_CUSHION = {
  color: '#e8e4dc',
  roughness: 0.72,
  metalness: 0.02,
};

const GOLD_ACCENT = {
  color: '#d4b35e',
  roughness: 0.18,
  metalness: 0.92,
};

const DARK_ACCENT = {
  color: '#2a2825',
  roughness: 0.8,
  metalness: 0.1,
};

/**
 * Headband assembly (Top arch, inner leather cushion, metallic slider extenders)
 */
export const HeadbandPart = React.forwardRef<THREE.Group, { isHovered?: boolean }>(
  ({ isHovered: _isHovered }, ref) => {
    // Generate inner cushion segments
    const cushionSegments = useMemo(() => {
      const count = 11;
      const radius = 1.34;
      const segments: Array<{ x: number; y: number; rotZ: number }> = [];
      const startAngle = Math.PI * 0.28;
      const endAngle = Math.PI * 0.72;

      for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const angle = startAngle + t * (endAngle - startAngle);
        segments.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius - 0.05,
          rotZ: angle - Math.PI / 2,
        });
      }
      return segments;
    }, []);

    return (
      <group ref={ref} name="Headband">
        {/* Main outer metal spring band arch */}
        <mesh position={[0, -0.05, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[1.36, 0.042, 24, 64, Math.PI * 0.74]} />
          <meshStandardMaterial {...BRUSHED_ALUMINUM} />
        </mesh>

        {/* Secondary parallel top stabilizer band */}
        <mesh position={[0, 0.04, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[1.39, 0.022, 16, 64, Math.PI * 0.68]} />
          <meshStandardMaterial {...BRUSHED_ALUMINUM} />
        </mesh>

        {/* Soft stitched leather center pad underneath */}
        <group position={[0, 0, 0]}>
          {cushionSegments.map((seg, i) => (
            <mesh
              key={i}
              position={[seg.x, seg.y, 0]}
              rotation={[0, 0, seg.rotZ]}
            >
              <capsuleGeometry args={[0.075, 0.1, 12, 16]} />
              <meshStandardMaterial {...LEATHER_CUSHION} />
            </mesh>
          ))}
        </group>

        {/* Left Slider / Extender Arm */}
        <group position={[-1.15, -0.42, 0]} rotation={[0, 0, -0.32]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.09, 0.44, 0.06]} />
            <meshStandardMaterial {...BRUSHED_ALUMINUM} />
          </mesh>
          {/* Millimeter calibration lines */}
          {[-0.12, -0.04, 0.04, 0.12].map((y, idx) => (
            <mesh key={idx} position={[0.046, y, 0]}>
              <boxGeometry args={[0.005, 0.015, 0.04]} />
              <meshStandardMaterial color="#888" roughness={0.5} />
            </mesh>
          ))}
          {/* Hinge Joint Block */}
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.08, 24]} />
            <meshStandardMaterial {...MATTE_WHITE} />
          </mesh>
        </group>

        {/* Right Slider / Extender Arm */}
        <group position={[1.15, -0.42, 0]} rotation={[0, 0, 0.32]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.09, 0.44, 0.06]} />
            <meshStandardMaterial {...BRUSHED_ALUMINUM} />
          </mesh>
          {/* Millimeter calibration lines */}
          {[-0.12, -0.04, 0.04, 0.12].map((y, idx) => (
            <mesh key={idx} position={[-0.046, y, 0]}>
              <boxGeometry args={[0.005, 0.015, 0.04]} />
              <meshStandardMaterial color="#888" roughness={0.5} />
            </mesh>
          ))}
          {/* Hinge Joint Block */}
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.08, 24]} />
            <meshStandardMaterial {...MATTE_WHITE} />
          </mesh>
        </group>
      </group>
    );
  }
);
HeadbandPart.displayName = 'HeadbandPart';

/**
 * Ear Cup Assembly (Can be Left or Right)
 * Left = FILMS
 * Right = MUSIC
 */
interface EarCupPartProps {
  side: 'left' | 'right';
  isHovered?: boolean;
}

export const EarCupPart = React.forwardRef<THREE.Group, EarCupPartProps>(
  ({ side, isHovered }, ref) => {
    const isLeft = side === 'left';
    const cupSign = isLeft ? -1 : 1;

    return (
      <group ref={ref} name={isLeft ? 'LeftCup' : 'RightCup'}>
        {/* Metal Swivel Yoke / C-Gimbal */}
        <group position={[0, 0.4, 0]}>
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[0.42, 0.035, 16, 32, Math.PI]} />
            <meshStandardMaterial {...BRUSHED_ALUMINUM} />
          </mesh>
          {/* Left pivot pin */}
          <mesh position={[-0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.032, 0.032, 0.06, 16]} />
            <meshStandardMaterial {...BRUSHED_ALUMINUM} />
          </mesh>
          {/* Right pivot pin */}
          <mesh position={[0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.032, 0.032, 0.06, 16]} />
            <meshStandardMaterial {...BRUSHED_ALUMINUM} />
          </mesh>
        </group>

        {/* Cup Center Pivot & Body */}
        <group position={[0, 0, 0]}>
          {/* Outer Ear Cup Shell (Matte White with subtle clearcoat) */}
          <mesh
            position={[cupSign * 0.08, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.54, 0.58, 0.34, 48]} />
            <meshStandardMaterial
              {...MATTE_WHITE}
              color={isHovered ? '#ffffff' : '#f7f6f2'}
            />
          </mesh>

          {/* Outer Circular Chamfer Cap with Aluminum Bezel */}
          <mesh
            position={[cupSign * 0.26, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.44, 0.46, 0.03, 48]} />
            <meshStandardMaterial {...BRUSHED_ALUMINUM} />
          </mesh>

          {/* Subtle concentric disk accent */}
          <mesh
            position={[cupSign * 0.28, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.32, 0.32, 0.015, 36]} />
            <meshStandardMaterial {...MATTE_WHITE} />
          </mesh>

          {/* Minimalist Tactile Dial / Center Button (Volume/Control or Microphone) */}
          <mesh
            position={[cupSign * 0.29, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.12, 0.12, 0.02, 24]} />
            <meshStandardMaterial {...BRUSHED_ALUMINUM} />
          </mesh>

          {/* Soft Plush Memory Foam Donut Cushion */}
          <mesh
            position={[cupSign * -0.16, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            castShadow
          >
            <torusGeometry args={[0.42, 0.14, 24, 48]} />
            <meshStandardMaterial
              {...LEATHER_CUSHION}
              roughness={isHovered ? 0.65 : 0.75}
            />
          </mesh>

          {/* Inside Acoustic Driver Grill / Baffle Plate */}
          <mesh
            position={[cupSign * -0.15, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <circleGeometry args={[0.34, 32]} />
            <meshStandardMaterial {...DARK_ACCENT} />
          </mesh>

          {/* Fine acoustic mesh ring accent */}
          <mesh
            position={[cupSign * -0.152, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <ringGeometry args={[0.18, 0.28, 32]} />
            <meshStandardMaterial
              color="#524e47"
              roughness={0.9}
              metalness={0.2}
            />
          </mesh>

          {/* Cable Terminal Port on Bottom of Left Cup */}
          {isLeft && (
            <group position={[0, -0.56, 0]}>
              <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.08, 20]} />
                <meshStandardMaterial {...BRUSHED_ALUMINUM} />
              </mesh>
              {/* Gold connector contact rim */}
              <mesh position={[0, -0.02, 0]}>
                <cylinderGeometry args={[0.038, 0.038, 0.02, 20]} />
                <meshStandardMaterial {...GOLD_ACCENT} />
              </mesh>
            </group>
          )}

          {/* Engraved L or R indicator badge */}
          <mesh
            position={[cupSign * 0.12, 0.42, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <boxGeometry args={[0.04, 0.06, 0.01]} />
            <meshStandardMaterial color="#949089" roughness={0.6} />
          </mesh>
        </group>
      </group>
    );
  }
);
EarCupPart.displayName = 'EarCupPart';

/**
 * Wired Audio Cable & 3.5mm Studio Jack Plug
 */
export const WiredCablePart = React.forwardRef<THREE.Group, { isHovered?: boolean }>(
  ({ isHovered: _isHovered }, ref) => {
    // Generate curved wire geometry using CatmullRomCurve3
    const cableCurve = useMemo(() => {
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.12, -0.35, 0.08),
        new THREE.Vector3(0.28, -0.75, 0.22),
        new THREE.Vector3(0.55, -1.2, 0.35),
        new THREE.Vector3(0.85, -1.65, 0.28),
        new THREE.Vector3(1.15, -2.1, 0.15),
        new THREE.Vector3(1.35, -2.5, 0.0),
      ];
      return new THREE.CatmullRomCurve3(points);
    }, []);

    const cableGeometry = useMemo(() => {
      return new THREE.TubeGeometry(cableCurve, 48, 0.028, 12, false);
    }, [cableCurve]);

    return (
      <group ref={ref} name="Cable">
        {/* Rubber strain relief boot at ear cup connection */}
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.042, 0.052, 0.1, 16]} />
          <meshStandardMaterial color="#dcd8cf" roughness={0.6} />
        </mesh>

        {/* Elegant braided audio cord */}
        <mesh geometry={cableGeometry}>
          <meshStandardMaterial
            color="#eae6dd"
            roughness={0.55}
            metalness={0.06}
          />
        </mesh>

        {/* 3.5mm Studio Mini-Jack Audio Plug at end of cable */}
        <group position={[1.35, -2.5, 0]} rotation={[0.4, 0.2, -0.5]}>
          {/* Jack strain relief sleeve */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.1, 16]} />
            <meshStandardMaterial color="#2a2825" roughness={0.7} />
          </mesh>

          {/* Knurled Aluminum Barrel */}
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.22, 24]} />
            <meshStandardMaterial {...BRUSHED_ALUMINUM} />
          </mesh>

          {/* Gold plated 3.5mm Tip */}
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.16, 20]} />
            <meshStandardMaterial {...GOLD_ACCENT} />
          </mesh>

          {/* TRS Insulator Rings */}
          <mesh position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.036, 0.036, 0.015, 20]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.43, 0]}>
            <cylinderGeometry args={[0.036, 0.036, 0.015, 20]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
        </group>
      </group>
    );
  }
);
WiredCablePart.displayName = 'WiredCablePart';
