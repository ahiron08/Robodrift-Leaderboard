import React from 'react';
import { buildRound2Slots, formatTime } from '../utils/leaderboardUtils';

export default function Round2Fixture({ qualifiers }) {
  const slots = buildRound2Slots(17, 30, 16, 15);
  const rows = qualifiers.map((t, i) => ({
    team: t,
    slot: slots[i],
  }));

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

      <table className="round2-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Team Name</th>
            <th>Total Time</th>
            <th>Time Slot</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ team, slot }, i) => (
            <tr key={team.teamId ?? team.teamName} className={i === 0 ? 'first-slot' : ''}>
              <td className="col-pos">{team.position}</td>
              <td className="col-team">{team.teamName}</td>
              <td className="col-id">{formatTime(team.totalTime)}</td>
              <td className="col-slot">{slot.start} – {slot.end}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pdf-actions">
        <button className="pdf-btn" onClick={() => window.print()}>Download / Print PDF</button>
      </div>
    </section>
  );
}