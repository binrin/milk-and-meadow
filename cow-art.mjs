import {COWS} from './classic-core.mjs';

export function cowAppearance(c, slot = 0) {
  const kind = c.kind;
  if (c.growRemaining > 0) return {stage: 'calf', kind, x: (kind % 4) * 100 / 3, y: Math.floor(kind / 4) * 50};
  return {stage: 'adult', kind, art: kind === 0 && slot % 3 === 1 ? 1 : COWS[kind].art};
}
