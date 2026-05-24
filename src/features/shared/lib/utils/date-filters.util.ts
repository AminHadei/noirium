import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Enable UTC and advanced format plugins
dayjs.extend(utc);
dayjs.extend(advancedFormat);
dayjs.extend(timezone);

const tzAbbrMap: Record<string, string> = {
  'Eastern Standard Time': 'EST',
  'Eastern Daylight Time': 'EDT',
  'Central Standard Time': 'CST',
  'Central Daylight Time': 'CDT',
  'Mountain Standard Time': 'MST',
  'Mountain Daylight Time': 'MDT',
  'Pacific Standard Time': 'PST',
  'Pacific Daylight Time': 'PDT',
};

// Type alias for datetime input formats
type DateTimeInput = string | Date | number;

const utcToLocal = (datetime: DateTimeInput): dayjs.Dayjs => {
  return dayjs.utc(datetime).local();
};

// Example: 2025-08-27 14:00:00 -> Wed, Aug 27th
export const formatShortDate = (datetime: DateTimeInput): string => {
  return utcToLocal(datetime).format('ddd, MMM Do');
};

// Example: 2025-08-27 14:00:00 -> 2:00 PM +03:30
export const formatFullTime = (datetime: DateTimeInput): string => {
  return utcToLocal(datetime).format('h:mm A Z');
};

// Example: "05:18:00" => "5h 18min", "02:00:00" => "2h"
export function formatDuration(duration: string): string {
  if (!duration?.includes(':')) return '';

  const parts = duration.split(':').map(Number);
  const hours = parts[0] ?? 0;
  const minutes = parts[1] ?? 0;

  const result: string[] = [];
  if (hours > 0) result.push(`${hours}h`);
  if (minutes > 0) result.push(`${minutes}min`);

  return result.length > 0 ? result.join(' ') : '0min';
}

export function formatWithAbbreviationTZ(value: DateTimeInput): string {
  const date = dayjs.utc(value).tz(dayjs.tz.guess());

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: dayjs.tz.guess(),
    timeZoneName: 'long',
  });

  const parts = formatter.formatToParts(date.toDate());

  const timeZonePart = parts.find((p: Intl.DateTimeFormatPart) => p.type === 'timeZoneName');
  const longName = typeof timeZonePart?.value === 'string' ? timeZonePart.value : '';
  const abbr = tzAbbrMap[longName] ?? '';

  if (abbr.length === 0) {
    return utcToLocal(value).format('h:mm A Z');
  }

  return `${date.format('h:mm A')} ${abbr}`;
}
