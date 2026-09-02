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

// Reserved for the future Ticket/Result output reveal (ADR-008 output slit
// peek cue), expressed as a fraction of SlotVisualFrame (not LogicalCanvas)
// so it stays valid once the canvas is visually cropped from the frame.
// Not implemented yet — SlotStage exists so this can be added as a sibling
// of SlotVisualFrame without being constrained by the frame's geometry.
export const OUTPUT_SLIT = {
  left: '20.33%',
  width: '52.80%',
  top: '97.2%',
  // Moved out of SlotOutputLayer's own hard-coded '8%' so all output-slit
  // geometry lives in one place (Result Quest redesign).
  height: '8%',
} as const;

/**
 * Dormant peek travel, keyed by `peekPhase` (see MainExperience's `peekPhase`
 * state and motionConfig's PEEK_EDGE_AT_MS/PEEK_HOLD_AT_MS). Values are
 * PLACEHOLDERS only -- final travel distance and easing for the "paper begins
 * deep inside the cavity and gradually emerges" direction are Figma-dependent.
 * Expressed as 0-100 so SlotOutputLayer can resolve a single 0-1 progress value
 * from them once OUTPUT_PEEK_ENABLED flips true.
 */
export const OUTPUT_PEEK_PROGRESS_BY_PHASE = {
  inside: 0,
  edge: 50,
  hold: 100,
} as const;

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
