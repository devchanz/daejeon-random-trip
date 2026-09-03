'use client';

import React from 'react';
import {
  SLOT_FRAME_ASPECT_RATIO,
  SLOT_FRAME_RESPONSIVE_WIDTH,
  OUTPUT_SLIT,
  OUTPUT_PEEK_PROGRESS_BY_PHASE,
} from './slotGeometry';

export interface SlotOutputLayerProps {
  revealStage: 'peek' | 'revealed' | 'minimized';
  /**
   * Sub-beat within 'peek' (see MainExperience's `peekPhase` state and
   * motionConfig's PEEK_EDGE_AT_MS/PEEK_HOLD_AT_MS). Meaningless outside
   * 'peek' -- once revealStage leaves it, the Result Card owns the reveal.
   */
  peekPhase?: 'inside' | 'edge' | 'hold';
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
 * --- Cavity occlusion architecture (Result Quest redesign, dormant) ---
 * The approved Figma direction has the paper begin deep inside the stainless
 * output cavity and gradually emerge: hidden -> inside cavity -> edge emerging
 * -> peek hold -> Result reveal. Two seams establish that, both inert while
 * OUTPUT_PEEK_ENABLED is false:
 *  1. Occlusion order -- this layer paints with an explicit z-index (z-[6])
 *     BELOW SlotVisualFrame's explicit z-10 (see SlotAnchor.tsx), so the
 *     chassis art itself hides the still-hidden portion of the paper by
 *     simple paint order, while this layer still mounts as a SlotVisualFrame
 *     *sibling* (ADR-022) so it is never subject to the frame's own
 *     overflow-hidden clip once emerged.
 *  2. RECOMMENDED, not yet added: a cavity clip wrapper (`overflow-hidden`)
 *     as a second guard for when the chassis art is not fully opaque right at
 *     the slit. Left undone here deliberately -- its exact clip bounds depend
 *     on where the final asset's slit actually sits, which cannot be
 *     verified without that asset; adding a guessed clip now risks silently
 *     cutting off the very "emerged" position this cue exists to show.
 * `peekPhase` resolves to a 0-100 progress value (OUTPUT_PEEK_PROGRESS_BY_PHASE
 * in slotGeometry.ts); the intended mechanism for the VISUAL pass is to drive
 * paper position from a single `--peek-progress` CSS custom property derived
 * from it, so retuning the final Figma travel/easing is a keyframe change on
 * one variable rather than a structural rewrite. No such keyframe exists yet
 * -- only the geometry and the resolved progress value are wired here.
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

export function SlotOutputLayer({ revealStage, peekPhase = 'inside' }: SlotOutputLayerProps) {
  // Stays mounted (when enabled) through 'peek' / 'revealed' / 'minimized' alike.
  // Resolved progress is consumed by the VISUAL pass's --peek-progress mechanism
  // (see doc above) -- not wired to a live transform yet since this never renders
  // while OUTPUT_PEEK_ENABLED is false.
  const progress =
    revealStage === 'peek'
      ? OUTPUT_PEEK_PROGRESS_BY_PHASE[peekPhase]
      : OUTPUT_PEEK_PROGRESS_BY_PHASE.hold;
  void progress;

  if (!OUTPUT_PEEK_ENABLED) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 z-[6] -translate-x-1/2"
      style={{
        width: SLOT_FRAME_RESPONSIVE_WIDTH,
        aspectRatio: `${SLOT_FRAME_ASPECT_RATIO}`,
      }}
    >
      <div
        data-testid="slot-output-layer"
        className="absolute rounded-sm border-2 border-[#2b2520] bg-[#fffef9] animate-output-peek"
        style={{
          left: OUTPUT_SLIT.left,
          width: OUTPUT_SLIT.width,
          top: OUTPUT_SLIT.top,
          height: OUTPUT_SLIT.height,
        }}
      />
    </div>
  );
}
