'use client';

import React from 'react';
import {
  SLOT_FRAME_ASPECT_RATIO,
  SLOT_FRAME_RESPONSIVE_WIDTH,
  OUTPUT_SLIT,
} from './slotGeometry';

export interface SlotOutputLayerProps {
  revealStage: 'peek' | 'revealed' | 'minimized';
}

/**
 * SlotOutputLayer -- physical paper/ticket peek cue at the slot machine's output slit.
 *
 * Mounts as a sibling of SlotVisualFrame (ADR-022), never inside it or inside
 * LogicalCanvas, so it is never subject to the frame's overflow-hidden clip
 * (ADR-020) and can extend past the chassis bounds.
 *
 * The wrapper below reproduces SlotVisualFrame's own width + aspect-ratio (not
 * SlotStage's, which is full-width) so that OUTPUT_SLIT's percentages --
 * documented in slotGeometry.ts as fractions of SlotVisualFrame -- resolve
 * against the correct box.
 *
 * DEV scope only: a simple physical paper cue. Ticket artwork, texture, exact
 * travel distance, and easing are for the VISUAL pass to tune within this
 * structure.
 *
 * --- Temporarily suppressed (Product decision, UX follow-up) ---
 * The DEV placeholder cue below reads as a plain white rectangle against the
 * production slot PNG -- wrong proportions for the slit, wrong material
 * language, and it collided with the helper copy underneath. It is disabled
 * until the dedicated Figma output-slit ticket asset exists. The mount point,
 * this component, its props, and the ADR-022 sibling contract all stay live
 * and dormant -- reinstating the cue is flipping OUTPUT_PEEK_ENABLED back to
 * true once the asset lands. The reopen affordance for a minimized Result now
 * lives in SlotAnchor's helper band, independent of this component.
 */
const OUTPUT_PEEK_ENABLED: boolean = false;

export function SlotOutputLayer({ revealStage }: SlotOutputLayerProps) {
  // Stays mounted (when enabled) through 'peek' / 'revealed' / 'minimized' alike.
  // Reserved for VISUAL: distinct per-stage treatment, if any.
  void revealStage;

  if (!OUTPUT_PEEK_ENABLED) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
      style={{
        width: SLOT_FRAME_RESPONSIVE_WIDTH,
        aspectRatio: `${SLOT_FRAME_ASPECT_RATIO}`,
      }}
    >
      <div
        data-testid="slot-output-layer"
        className="absolute rounded-sm border-2 border-[#2b2520] bg-[#fffef9] shadow-retro-sm animate-output-peek"
        style={{
          left: OUTPUT_SLIT.left,
          width: OUTPUT_SLIT.width,
          top: OUTPUT_SLIT.top,
          height: '8%',
        }}
      />
    </div>
  );
}
