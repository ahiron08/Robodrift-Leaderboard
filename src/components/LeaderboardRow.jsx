import React from 'react';
import { formatTime, computeRawTotal, computeFinalTime, computePenalty } from '../utils/leaderboardUtils';

export default function LeaderboardRow({ team }) {
  const raw = computeRawTotal(team);
  const final = computeFinalTime(team);
  const penalty = computePenalty(team);
  const pos = team.position;
  const rowClass = `row ${pos === 1 ? 'row-first' : pos === 2 ? 'row-second' : pos === 3 ? 'row-third' : ''}`;
  const hasBreakdown = Array.isArray(team.penalties) && team.penalties.length > 0;
  const penaltyLabel = `+${penalty.toFixed(2)}s`;

  return (
    <>
      <tr className={rowClass + ' desktop-row'}>
        <td className="col-pos">{pos ?? '--'}</td>
        <td className="col-team">{team.teamName}</td>
        <td className="col-time">{formatTime(team.lap1)}</td>
        <td className="col-time">{formatTime(team.lap2)}</td>
        <td className="col-penalty" title={hasBreakdown ? team.penalties.map(p => `${p.reason}: +${Number(p.time).toFixed(2)}s`).join('\n') : ''}>
          <span className="penalty-value">{penaltyLabel}</span>
          {hasBreakdown && <span className="penalty-info" aria-label="penalty details">ⓘ</span>}
        </td>
        <td className="col-final">{formatTime(final)}</td>
      </tr>
      <div className={rowClass + ' mobile-card'}>
        <div className="mc-top">
          <span className="mc-pos">{pos ?? '--'}</span>
          <span className="mc-name">{team.teamName}</span>
          <span className="mc-total">{formatTime(final)}</span>
        </div>
        <div className="mc-laps">
          <span>Lap 1: {formatTime(team.lap1)}</span>
          <span>Lap 2: {formatTime(team.lap2)}</span>
          <span className="penalty-value">Penalty: {penaltyLabel}</span>
        </div>
      </div>
    </>
  );
}