import { ZONES } from '../../data/zones';

const DURATION_LABELS: Record<string, string> = {
  half: '반나절',
  full: '하루',
};

const PREFERENCE_LABELS: Record<string, string> = {
  anything: '아무거나',
  food: '먹방',
  walk: '산책',
  photo: '사진',
};

/** Minimal trip-context label helpers shared by the Random Log board and detail views. */
export function getZoneLabel(zoneId: string): string {
  return ZONES.find((zone) => zone.id === zoneId)?.name ?? zoneId;
}

export function getDurationLabel(durationType: string): string {
  return DURATION_LABELS[durationType] ?? durationType;
}

export function getPreferenceLabel(preferenceType: string): string {
  return PREFERENCE_LABELS[preferenceType] ?? preferenceType;
}

/**
 * All Random Log timestamps are Korean service timestamps and must render
 * identically regardless of the executing runtime's local timezone -- these
 * surfaces are server-rendered (Right Rail preview, /random-log, /random-log/[id]),
 * and the server process's TZ is not guaranteed to be KST. `Date.prototype`
 * getters (getMonth/getDate/getHours/getMinutes/getFullYear) read the *local*
 * timezone of whatever process calls them, so they must not be used here.
 */
const KST_TIME_ZONE = 'Asia/Seoul';

/** Extracts KST calendar/time fields for an ISO timestamp via Intl (no date library). */
function getKstParts(iso: string): {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
} {
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: KST_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const lookup = (type: string) => parts.find((part) => part.type === type)?.value ?? '';

  return {
    year: lookup('year'),
    month: lookup('month'),
    day: lookup('day'),
    hour: lookup('hour'),
    minute: lookup('minute'),
  };
}

/** Formats an ISO timestamp as `MM.DD HH:mm` in Asia/Seoul, matching the existing rail-preview convention. */
export function formatShortTimestamp(iso: string): string {
  const { month, day, hour, minute } = getKstParts(iso);
  return `${month}.${day} ${hour}:${minute}`;
}

/** Formats an ISO timestamp with the full year in Asia/Seoul for the detail page. */
export function formatFullTimestamp(iso: string): string {
  const { year, month, day, hour, minute } = getKstParts(iso);
  return `${year}.${month}.${day} ${hour}:${minute}`;
}
