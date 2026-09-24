export type HeadphoneState = 'assembled' | 'exploding' | 'exploded';

export type CursorMode = 'default' | 'rotate' | 'open' | 'click' | 'reconstruct' | 'drag';

export type ActiveDestination = null | 'films' | 'music';

export interface HeadphonePartTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

