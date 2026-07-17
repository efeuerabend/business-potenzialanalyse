/*
 * Report metadata — a reference ID and creation timestamp for a generated
 * report. There is no backend, so the ID is date-based with a random suffix
 * (not a sequential counter) — unique enough for reference purposes at this
 * product's volume, without requiring server-side coordination.
 */

/** @returns {{ id: string, createdAt: string }} */
export function createReportMeta(date = new Date()) {
  return {
    id: generateReportId(date),
    createdAt: date.toISOString(),
  };
}

function generateReportId(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
  return `BPA-${y}${m}${d}-${seq}`;
}

/** Formats an ISO timestamp as "TT.MM.JJJJ HH:MM". */
export function formatReportDate(isoString) {
  const date = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
