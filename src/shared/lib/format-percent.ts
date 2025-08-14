export const formatPercent = (n: number) => `${(n * 100).toFixed(0)}%`;
export const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));

export function last7DaysRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 7);
  const toStr = to.toISOString().slice(0, 10);
  const fromStr = from.toISOString().slice(0, 10);
  return { from: fromStr, to: toStr };
}