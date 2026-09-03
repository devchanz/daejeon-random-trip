'use client';

import React from 'react';
import {
  SLOT_FRAME_ASPECT_RATIO,
  SLOT_FRAME_RESPONSIVE_WIDTH,
  SLOT_OUTPUT_LIP_CLIP_PATH,
  SLOT_PEEK_WINDOW,
  LOGICAL_CANVAS_HEIGHT,
  LOGICAL_CANVAS_TRANSLATE_X_PCT,
  LOGICAL_CANVAS_TRANSLATE_Y_PCT,
  LOGICAL_CANVAS_WIDTH,
  LOGICAL_CANVAS_WIDTH_PCT,
} from './slotGeometry';
import { RESULT_BODY_PAPER } from './result/resultSkin';

export interface SlotOutputLayerProps {
  /**
   * The chassis PNG currently shown by SlotAnchor's own LogicalCanvas
   * (`slot-idle.png` / `slot-pulled.png`, chosen by lever state). Re-instanced
   * here rather than duplicated as a literal, so the foreground lip is
   * guaranteed to be the SAME cached, already-decoded bitmap SlotAnchor is
   * already painting -- never a second raster, never a state mismatch. (The
   * cavity/lip pixels are byte-identical between the two source images
   * anyway, so even a hypothetical mismatch could not be seen.)
   */
  chassisSrc: string;
}

/**
 * SlotOutputLayer -- physical paper/ticket Peek at the slot machine's output
 * cavity, shown only while `revealStage === 'peek'` (mounted conditionally by
 * SlotAnchor -- see its own `revealStage === 'peek' && <SlotOutputLayer .../>`
 * call).
 *
 * Mounts as a sibling of SlotVisualFrame (ADR-022), never inside it or inside
 * LogicalCanvas, so it is never subject to the frame's overflow-hidden clip
 * (ADR-020). The wrapper below reproduces SlotVisualFrame's own width +
 * aspect-ratio (not SlotStage's, which is full-width) so that every rect
 * below -- fractions of SlotVisualFrame, per slotGeometry.ts -- resolves
 * against the correct box at any responsive width or DPR.
 *
 * --- Architecture (docs/DECISIONS.md ADR-036) ---
 * Two layers, both transform/clip-based, zero new assets:
 *
 *  1. PEEK WINDOW + PAPER STRIP: an `overflow-hidden` window clipped to
 *     SLOT_PEEK_WINDOW (spanning the lip's top down through the cavity's own
 *     dark bottom rim -- paper can never visually reach the pedestal or the
 *     helper band below the chassis). Inside it, a DOM/CSS paper strip --
 *     the Result sheet's own measured paper token (RESULT_BODY_PAPER) plus a
 *     cobalt rail + dark outline (the Result sheet's own frame signature) and
 *     a recessed top shadow -- so it reads as paper continuing inside the
 *     machine, not a plain white rectangle (the documented reason the old DEV
 *     placeholder was rejected) and not a miniature Result card (no bottom
 *     edge is ever visible: the strip's own height is 160% of the window, so
 *     its top and bottom are never both inside the visible area at once).
 *
 *  2. FOREGROUND LIP: the EXACT chassis raster SlotAnchor is already
 *     rendering, re-instanced through the same LOGICAL_CANVAS_* transform and
 *     clipped via `clip-path: inset()` to SLOT_OUTPUT_LIP -- a percentage of
 *     this same frame box, so it can never drift from the real chassis at any
 *     width/DPR. This occludes the paper's top edge, because the cavity is
 *     fully OPAQUE in the source art (measured by direct PNG decode) --
 *     paint-order occlusion underneath the chassis (the originally-dormant
 *     ADR-022 scaffold's plan) would render the paper completely invisible.
 *
 * --- Motion contract ---
 * The paper strip's BASE (non-animated) CSS state is HOLD (no transform
 * applied at all is equal to the animation's own `100%` keyframe,
 * `translateY(0)`) -- `.animate-output-peek` supplies ONLY the travel-in
 * (`0% { translateY(-100%) } -> 100% { translateY(0) }`, see globals.css).
 * Suppressed by `prefers-reduced-motion` (existing entry in globals.css),
 * cancelled for any other reason, or frame-starved, the element rests at
 * exactly the correct final position -- there is no reachable half-revealed
 * state. State correctness (`revealStage`) is owned entirely by
 * ExperienceProvider's timer/reconciliation contract, never by this
 * animation -- see ExperienceProvider.tsx.
 *
 * `aria-hidden` + `pointer-events-none` throughout: purely decorative, no
 * layout participation (the wrapper is `absolute`, contributing 0px to
 * SlotStage's height budget).
 */
export function SlotOutputLayer({ chassisSrc }: SlotOutputLayerProps) {
  return (
    <div
      aria-hidden="true"
      data-testid="slot-output-layer"
      className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2"
      style={{
        width: SLOT_FRAME_RESPONSIVE_WIDTH,
        aspectRatio: `${SLOT_FRAME_ASPECT_RATIO}`,
      }}
    >
      {/* Peek window: clips the paper strip to the lip-top -> cavity-bottom span. */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: SLOT_PEEK_WINDOW.left,
          width: SLOT_PEEK_WINDOW.width,
          top: SLOT_PEEK_WINDOW.top,
          height: SLOT_PEEK_WINDOW.height,
        }}
      >
        {/* Paper strip. inset-x leaves the window's own left/right edge visible
            as dark cavity wall on both sides, so the sheet reads as an object
            INSIDE the machine rather than filling the whole cutout. Height is
            160% of the window and top-anchored at 0 -- its bottom edge is
            never inside the visible window, so this can never read as "a
            completed card with a bottom border". */}
        <div
          className="animate-output-peek absolute inset-x-[4%] top-0 h-[160%]"
          style={{
            backgroundColor: RESULT_BODY_PAPER,
            border: '1px solid #060b12',
            boxShadow:
              'inset 0 0 0 3px #2b6fe2, inset 0 14px 10px -8px rgba(0,0,0,0.45)',
          }}
        />
      </div>

      {/* Foreground lip: the exact chassis raster SlotAnchor already renders,
          re-instanced through the identical LOGICAL_CANVAS_* transform and
          clipped to the lip rect -- so it can never drift from the real
          chassis at any width/DPR, and requires no independent pixel offsets. */}
      <div
        className="absolute inset-0"
        style={{ clipPath: SLOT_OUTPUT_LIP_CLIP_PATH }}
      >
        <div
          className="absolute top-0 left-0"
          style={{
            width: `${LOGICAL_CANVAS_WIDTH_PCT}%`,
            aspectRatio: `${LOGICAL_CANVAS_WIDTH} / ${LOGICAL_CANVAS_HEIGHT}`,
            transform: `translate(${LOGICAL_CANVAS_TRANSLATE_X_PCT}%, ${LOGICAL_CANVAS_TRANSLATE_Y_PCT}%)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={chassisSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-contain select-none"
          />
        </div>
      </div>
    </div>
  );
}
