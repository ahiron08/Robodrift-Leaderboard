export function formatTime(value) {
  if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) {
    return '--';
  }
  const n = Number(value);
  if (!Number.isFinite(n)) return '--';
  const total = Math.round(n);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function computePenalty(team) {
  if (Array.isArray(team?.penalties) && team.penalties.length > 0) {
    return team.penalties.reduce((sum, p) => {
      const t = toNumber(p?.time);
      return sum + (t !== null ? t : 0);
    }, 0);
  }
  const pt = toNumber(team?.penaltyTime);
  return pt !== null ? pt : 0;
}

export function computeRawTotal(team) {
  if (team.totalTime !== undefined && team.totalTime !== null && team.totalTime !== '') {
    const t = toNumber(team.totalTime);
    if (t !== null) return t;
  }
  const l1 = toNumber(team.lap1);
  const l2 = toNumber(team.lap2);
  if (l1 !== null && l2 !== null) return l1 + l2;
  return null;
}

export function computeFinalTime(team) {
  const raw = computeRawTotal(team);
  if (raw === null) return null;
  return raw + computePenalty(team);
}

export function computeTotal(team) {
  return computeFinalTime(team);
}

export function isComplete(team) {
  const l1 = toNumber(team.lap1);
  const l2 = toNumber(team.lap2);
  const total = computeRawTotal(team);
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

export function getRound2Qualifiers(results, limit = 16) {
  const seen = new Set();
  const unique = [];
  (results || []).forEach((t) => {
    const key = t?.teamId !== undefined && t?.teamId !== null ? `id:${t.teamId}` : `name:${t?.teamName}`;
    if (seen.has(key)) return;
    seen.add(key);
    unique.push(t);
  });
  const sorted = [...unique].sort((a, b) => {
    const ta = computeFinalTime(a);
    const tb = computeFinalTime(b);
    const va = ta === null ? Infinity : ta;
    const vb = tb === null ? Infinity : tb;
    if (va !== vb) return va - vb;
    return String(a?.teamName ?? '').localeCompare(String(b?.teamName ?? ''));
  });
  return sorted.slice(0, limit).map((t, i) => ({
    ...t,
    position: i + 1,
    totalTime: computeFinalTime(t),
  }));
}

export function buildRound2Slots(startHour = 17, startMinute = 30, count = 16, durationMinutes = 15) {
  const slots = [];
  let totalMinutes = startHour * 60 + startMinute;
  for (let i = 0; i < count; i++) {
    const start = totalMinutes;
    const end = totalMinutes + durationMinutes;
    slots.push({
      slot: String(i + 1).padStart(2, '0'),
      startMinutes: start,
      endMinutes: end,
      start: formatClock(start),
      end: formatClock(end),
    });
    totalMinutes = end;
  }
  return slots;
}

function formatClock(mins) {
  const h24 = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}