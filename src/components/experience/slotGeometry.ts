/**
 * Measured geometry for the slot machine production assets
 * (slot-idle.png / slot-pulled.png / slot-shell.png).
 *
 * All three are 1800x1500px RGBA renders of a 600x500 logical design canvas
 * (exact 3x scale). The physical bounds below are the union of non-transparent
 * (alpha > 0) pixels across all three states, measured by direct PNG decoding
 * and cross-checked against the Figma reference (00_FINAL_REFERENCE /
 * Landing/Desktop, file oyEWRpRpaslcF3Iyuw3Jfa, node 18:315).
 *
 * SlotVisualFrame is sized to exactly this physical box, so it can sit in
 * normal document flow with no transparent-canvas padding compensation.
 * LogicalCanvas keeps the original 600x500 coordinate system and is scaled
 * and translated inside the frame so that its physical bounds land exactly
 * on the frame's edges.
 */

// Logical 600x500 design canvas coordinate system.
export const LOGICAL_CANVAS_WIDTH = 600;
export const LOGICAL_CANVAS_HEIGHT = 500;

// Union of non-transparent pixels across idle/pulled/shell, in logical units.
export const SLOT_PHYSICAL_BOUNDS = {
  x: 168,
  y: 149,
  width: 280 + 1 / 3,
  height: 204 + 2 / 3,
} as const;

// Same bounds as fractions of the logical canvas.
export const SLOT_PHYSICAL_FRACTION = {
  x: SLOT_PHYSICAL_BOUNDS.x / LOGICAL_CANVAS_WIDTH, // 0.28
  y: SLOT_PHYSICAL_BOUNDS.y / LOGICAL_CANVAS_HEIGHT, // 0.298
  width: SLOT_PHYSICAL_BOUNDS.width / LOGICAL_CANVAS_WIDTH, // ~0.467222
  height: SLOT_PHYSICAL_BOUNDS.height / LOGICAL_CANVAS_HEIGHT, // ~0.409333
} as const;

// SlotVisualFrame aspect ratio == physical machine aspect ratio.
export const SLOT_FRAME_ASPECT_RATIO =
  SLOT_PHYSICAL_BOUNDS.width / SLOT_PHYSICAL_BOUNDS.height;

// LogicalCanvas size (as % of SlotVisualFrame width) and translation (as % of
// LogicalCanvas's own box, per the CSS transform spec) so its physical bounds
// land exactly on the frame edges regardless of the frame's rendered size.
export const LOGICAL_CANVAS_WIDTH_PCT =
  (LOGICAL_CANVAS_WIDTH / SLOT_PHYSICAL_BOUNDS.width) * 100; // ~214.0309%
export const LOGICAL_CANVAS_TRANSLATE_X_PCT = -SLOT_PHYSICAL_FRACTION.x * 100; // -28%
export const LOGICAL_CANVAS_TRANSLATE_Y_PCT = -SLOT_PHYSICAL_FRACTION.y * 100; // -29.8%

// Reel window group bounds (% of the 600x500 logical canvas). Unchanged from
// prior verified geometry: 3 interior transparent cutouts at exactly these bounds.
export const REEL_GROUP = {
  left: '35.333%',
  top: '34.4%',
  width: '29.0%',
  height: '14.2%',
  gap: '5.17%',
} as const;

// Primary CTA hitbox (% of the 600x500 logical canvas). Deliberately unchanged
// in this pass even though the painted button is visually larger (~37-38%
// of the machine per both the production PNG and the Figma reference) —
// widening it is a separate, isolated interaction change.
export const CTA_BUTTON = {
  left: '42.5%',
  top: '54.0%',
  width: '15.0%',
  height: '6.0%',
} as const;

/**
 * Slot Peek geometry (docs/DECISIONS.md ADR-036) -- measured by direct PNG
 * decoding of the production chassis art (slot-idle.png / slot-pulled.png,
 * 1800x1500px = exactly 3x the 600x500 logical canvas). All three rects are
 * expressed as fractions of SlotVisualFrame (not LogicalCanvas), matching
 * every other constant in this file's "Reserved for the future Ticket/Result
 * output reveal" contract, so they stay valid once the canvas is visually
 * cropped from the frame and remain correct at any responsive width/DPR with
 * zero measured pixels and zero JS geometry reads.
 *
 * This SUPERSEDES the historical `OUTPUT_SLIT` constant (removed): that
 * rect's x-range was actually the PEDESTAL footprint, not the slit, and its
 * `top: 97.2%` placed it below the cavity, extending past the chassis bottom
 * into the helper band beneath SlotStage -- the documented root cause of the
 * DEV placeholder's "plain white rectangle... collided with the helper copy"
 * rejection. The rects below were re-measured from scratch against the
 * chassis's actual opaque/dark pixel bounds, not carried forward.
 *
 * Verified: the cavity/lip pixels are byte-identical between slot-idle.png
 * and slot-pulled.png (0 differing pixels across the scanned region), so this
 * geometry is lever-state-independent -- one set of rects serves both states.
 *
 *   SLOT_OUTPUT_LIP     the painted lip's front face (logical x 233.67-364.67,
 *                       y 323-331.67) -- the foreground occluder re-instances
 *                       the chassis raster clipped to exactly this rect.
 *   SLOT_OUTPUT_CAVITY  the recessed, fully-opaque-in-the-source-art cavity
 *                       mouth/interior (logical x 252.33-345.33, y 332-344).
 *   SLOT_PEEK_WINDOW    the lip-top -> cavity-bottom span the paper strip is
 *                       clipped to (union of the two rects above); its bottom
 *                       edge lands on the cavity's own dark bottom rim, so
 *                       paper can never visually reach the pedestal or the
 *                       helper band below the chassis.
 */
export const SLOT_OUTPUT_LIP = {
  left: '23.43%',
  width: '46.73%',
  top: '85.02%',
  height: '4.23%',
} as const;

export const SLOT_OUTPUT_CAVITY = {
  left: '30.08%',
  width: '33.17%',
  top: '89.41%',
  height: '5.86%',
} as const;

export const SLOT_PEEK_WINDOW = {
  left: '30.08%',
  width: '33.17%',
  top: '85.02%',
  height: '10.26%',
} as const;

/**
 * `left/width/top/height` -> a `clip-path: inset(top right bottom left)`
 * string, derived (not independently re-typed) from SLOT_OUTPUT_LIP so the
 * foreground-lip clip in SlotOutputLayer.tsx can never drift from the same
 * single measured rect above.
 */
function rectToInsetClipPath(rect: {
  left: string;
  width: string;
  top: string;
  height: string;
}): string {
  const left = parseFloat(rect.left);
  const width = parseFloat(rect.width);
  const top = parseFloat(rect.top);
  const height = parseFloat(rect.height);
  const right = 100 - (left + width);
  const bottom = 100 - (top + height);
  return `inset(${top}% ${right}% ${bottom}% ${left}%)`;
}

/** `clip-path` for the foreground lip re-instance -- see SlotOutputLayer.tsx. */
export const SLOT_OUTPUT_LIP_CLIP_PATH = rectToInsetClipPath(SLOT_OUTPUT_LIP);

// Fluid physical width of SlotVisualFrame. Column-aware (never exceeds the
// available width). Desktop targets are ~4% below the original hero-scale
// pass (540/640/730) to restore balance against the enlarged Setup card;
// the mobile floor (360px) is untouched, so mobile physical size is unchanged:
//   375px viewport  -> ~351px physical (unchanged)
//   1200px viewport -> ~518px physical (was ~540, -4%)
//   1440px viewport -> ~614px physical (was ~640, -4%)
//   1920px viewport -> ~700px physical (was ~730, -4%)
export const SLOT_FRAME_RESPONSIVE_WIDTH =
  'min(100%, clamp(360px, calc(38px + 40vw), 700px))';

/**
 * Mobile-hero resolution of SLOT_FRAME_RESPONSIVE_WIDTH's `min(100%, ...)` term,
 * with the hero column's own bounds substituted for "100%" (page.tsx's mobile
 * `<main>` is `w-full max-w-[480px]` inside a `px-3` section, so its available
 * width is `min(100vw - 24px, 480px)`).
 *
 * Exists so page.tsx can compute the mobile hero's height budget (short-height
 * viewport hotfix, docs/PROJECT_STATE.md) without hard-coding a second copy of
 * the slot-frame width expression -- this file stays the single source of truth
 * for slot geometry (AGENTS.md Sec.3: no UI hard-coding of business/layout
 * constants). If page.tsx's mobile hero column width or padding ever changes,
 * update the two literals below (24px, 480px) to match.
 */
export const MOBILE_SLOT_FRAME_WIDTH =
  'min(min(100vw - 24px, 480px), clamp(360px, 38px + 40vw, 700px))';
export const MOBILE_SLOT_FRAME_HEIGHT = `calc((${MOBILE_SLOT_FRAME_WIDTH}) / ${SLOT_FRAME_ASPECT_RATIO})`;
