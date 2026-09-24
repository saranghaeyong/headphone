export type CursorMode = 'default' | 'rotate' | 'open' | 'click' | 'reconstruct' | 'drag';

export type ActiveDestination = null | 'films' | 'music';

export interface HeadphonePartTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface ExplosionProgress {
  value: number; // 0 = assembled, 1 = fully exploded
}

export type SceneState = 'idle' | 'exploding' | 'exploded' | 'reconstructing';
