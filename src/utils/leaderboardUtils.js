export function formatTime(value) {
  if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) {
    return '--';
  }
  const n = Number(value);
  if (!Number.isFinite(n)) return '--';
  return n.toFixed(2);
}

export function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function computeTotal(team) {
  if (team.totalTime !== undefined && team.totalTime !== null && team.totalTime !== '') {
    const t = toNumber(team.totalTime);
    if (t !== null) return t;
  }
  const l1 = toNumber(team.lap1);
  const l2 = toNumber(team.lap2);
  if (l1 !== null && l2 !== null) return l1 + l2;
  return null;
}

export function isComplete(team) {
  const l1 = toNumber(team.lap1);
  const l2 = toNumber(team.lap2);
  const total = computeTotal(team);
  return l1 !== null && l2 !== null && total !== null;
}

export function sortLeaderboard(results) {
  const completed = [];
  const incomplete = [];
  (results || []).forEach((t) => {
    if (isComplete(t)) completed.push(t);
    else incomplete.push(t);
  });
  completed.sort((a, b) => {
    const ta = computeTotal(a);
    const tb = computeTotal(b);
    if (ta !== tb) return ta - tb;
    const a1 = toNumber(a.lap1) ?? 0;
    const b1 = toNumber(b.lap1) ?? 0;
    if (a1 !== b1) return a1 - b1;
    const a2 = toNumber(a.lap2) ?? 0;
    const b2 = toNumber(b.lap2) ?? 0;
    return a2 - b2;
  });
  return { completed, incomplete };
}

export function assignPositions(completed) {
  return completed.map((t, i) => ({ ...t, position: i + 1 }));
}