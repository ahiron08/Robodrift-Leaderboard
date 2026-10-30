import React from 'react';
import { formatTime, computeTotal } from '../utils/leaderboardUtils';

export default function LeaderboardRow({ team, isTop }) {
  const total = computeTotal(team);
  const pos = team.position;
  const rowClass = `row ${pos === 1 ? 'row-first' : pos === 2 ? 'row-second' : pos === 3 ? 'row-third' : ''}`;

  return (
    <>
      <tr className={rowClass + ' desktop-row'}>
        <td className="col-pos">{pos ?? '--'}</td>
        <td className="col-team">{team.teamName}</td>
        <td className="col-time">{formatTime(team.lap1)}</td>
        <td className="col-time">{formatTime(team.lap2)}</td>
        <td className="col-total">{formatTime(total)}</td>
      </tr>
      <div className={rowClass + ' mobile-card'}>
        <div className="mc-top">
          <span className="mc-pos">{pos ?? '--'}</span>
          <span className="mc-name">{team.teamName}</span>
          <span className="mc-total">{formatTime(total)}</span>
        </div>
        <div className="mc-laps">
          <span>Lap 1: {formatTime(team.lap1)}</span>
          <span>Lap 2: {formatTime(team.lap2)}</span>
        </div>
      </div>
    </>
  );
}