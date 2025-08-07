export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const hStr = hrs > 0 ? String(hrs).padStart(2, "0") + ":" : "";
  const mStr = String(mins).padStart(2, "0");
  const sStr = String(secs).padStart(2, "0");

  return hStr + mStr + ":" + sStr;
}