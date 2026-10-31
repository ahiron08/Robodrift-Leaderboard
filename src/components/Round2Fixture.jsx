import React, { useState, useMemo, useCallback } from 'react';
import { buildRound2Slots } from '../utils/leaderboardUtils';

const OTHER_COLLEGE_NAMES = new Set([
  'stellar robotics',
  'red hair bots',
  'red hare bots',
  'team airavat',
  'airavat',
]);

function isOtherCollege(team) {
  const name = String(team?.teamName ?? '').trim().toLowerCase();
  return OTHER_COLLEGE_NAMES.has(name);
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const STORAGE_KEY = 'round2fixture_seed';

export default function Round2Fixture({ qualifiers }) {
  const [seed, setSeed] = useState(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    const n = stored ? Number(stored) : NaN;
    return Number.isFinite(n) ? n : Math.floor(Math.random() * 1e9);
  });

  const regenerate = useCallback(() => {
    const newSeed = Math.floor(Math.random() * 1e9);
    setSeed(newSeed);
    try { window.localStorage.setItem(STORAGE_KEY, String(newSeed)); } catch (e) {}
  }, []);

  const slots = useMemo(() => buildRound2Slots(17, 30, 16, 15), []);

  const rows = useMemo(() => {
    const rng = mulberry32(seed);
    const others = qualifiers.filter(isOtherCollege);
    const nits = qualifiers.filter((t) => !isOtherCollege(t));
    const shuffledOthers = shuffle(others, rng);
    const shuffledNits = shuffle(nits, rng);

    const earlyIdx = shuffle([0, 1, 2, 3, 4, 5], rng);
    const lateIdx = shuffle([6, 7, 8, 9, 10, 11, 12, 13, 14, 15], rng);

    const assignment = new Array(qualifiers.length);
    shuffledOthers.forEach((t, i) => {
      assignment[lateIdx[i]] = t;
    });
    const usedLate = shuffledOthers.length;
    const remainingSlots = [...earlyIdx, ...lateIdx.slice(usedLate)];
    shuffledNits.forEach((t, i) => {
      assignment[remainingSlots[i]] = t;
    });

    return assignment.map((team, i) => ({
      team,
      slot: slots[i],
      other: isOtherCollege(team),
    }));
  }, [qualifiers, seed, slots]);

  return (
    <section className="round2-panel">
      <div className="round2-heading">
        <h2>ROUND 2 TEAMS &amp; FIXTURE</h2>
        <div className="round-badge">ROUND 2</div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">16 Qualified Teams</div>
        <div className="summary-card">15 Minutes Per Team</div>
        <div className="summary-card">Starting at 5:30 PM</div>
      </div>

      <div className="pdf-actions" style={{ marginBottom: '1rem' }}>
        <button className="pdf-btn" onClick={regenerate}>Regenerate Fixture</button>
        <button className="pdf-btn" onClick={() => window.print()}>Download / Print PDF</button>
      </div>

      <table className="round2-table">
        <thead>
          <tr>
            <th>Match</th>
            <th>Team Name</th>
            <th>Scheduled Time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ team, slot, other }, i) => (
            <tr key={team.teamId ?? team.teamName} className={other ? 'other-college' : 'nit-silchar'}>
              <td className="col-pos">{i + 1}</td>
              <td className="col-team">{team.teamName}</td>
              <td className="col-slot">{slot.start} – {slot.end}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
