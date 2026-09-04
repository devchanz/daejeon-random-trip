/**
 * Approved production custom-event taxonomy (16 events) and the approved
 * shared-parameter whitelist for the Daejeon Random Trip GA4/GTM integration.
 *
 * This is the ONLY place these names/keys are declared -- `pushDataLayerEvent`
 * (dataLayer.ts) enforces both lists at runtime, and every call site imports
 * `AnalyticsEventName`/`AnalyticsEventParams` from here rather than typing
 * event names or param keys as bare string literals.
 */

export const ANALYTICS_EVENT_NAMES = [
  'landing_view',
  'intro_start',
  'q1_select',
  'q2_select',
  'spin',
  'result_view',
  'route_cta',
  'place_map_click',
  'share',
  'reroll',
  'todays_daejeon_view',
  'todays_daejeon_next',
  'todays_daejeon_prev',
  'todays_daejeon_click',
  'explore_more_click',
  'random_log_submit',
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

/** Allowed `share_method` values -- native Web Share vs. clipboard fallback. */
export type ShareMethod = 'native_share' | 'clipboard';

/**
 * Product-parameter keys a CALL SITE may pass to `pushDataLayerEvent`.
 * UTM keys are deliberately excluded here -- they are attached automatically
 * by the dispatcher from the session's stored attribution (see
 * `src/lib/attribution/utmSession.ts`), never supplied by call sites.
 */
export const ANALYTICS_CALLER_PARAM_KEYS = [
  'duration_type',
  'preference_type',
  'zone_id',
  'route_id',
  'stop_count',
  'editorial_id',
  'editorial_position',
  'editorial_url',
  'share_method',
] as const;

export type AnalyticsCallerParamKey = (typeof ANALYTICS_CALLER_PARAM_KEYS)[number];

/** UTM parameter keys, auto-attached by the dispatcher -- never passed by call sites. */
export const ANALYTICS_UTM_PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
] as const;

export type AnalyticsUtmParamKey = (typeof ANALYTICS_UTM_PARAM_KEYS)[number];

/**
 * Params a call site may pass. `share_method` is intentionally typed to the
 * closed `ShareMethod` union; every other key is a free string/number that
 * `pushDataLayerEvent` still sanitizes and caps defensively at runtime.
 */
export type AnalyticsEventParams = Partial<
  Omit<Record<AnalyticsCallerParamKey, string | number | undefined>, 'share_method'> & {
    share_method?: ShareMethod;
  }
>;
