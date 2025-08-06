import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatDate(dateStr: string, fallbackFormat = 'YYYY.MM.DD'): string {
  const now = dayjs();
  const date = dayjs(dateStr);

  const diffDays = now.diff(date, 'day');

  if (diffDays <= 0) return 'Today'
  if (diffDays == 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.format(fallbackFormat);
}