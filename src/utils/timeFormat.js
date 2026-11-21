export function formatDurationMs(ms, showTenths = false) {
  const safeMs = Math.max(0, ms || 0);
  const totalSeconds = Math.floor(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((safeMs % 1000) / 100);

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  if (showTenths) {
    return `${mm}:${ss}.${tenths}`;
  }
  return `${mm}:${ss}`;
}

export function formatSecondsShort(ms) {
  const sec = (Math.max(0, ms || 0) / 1000).toFixed(1);
  return `${sec}s`;
}
