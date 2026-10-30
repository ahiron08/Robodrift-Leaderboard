import React from 'react';
import LeaderboardRow from './LeaderboardRow';

export default function Leaderboard({ completed, incomplete }) {
  return (
    <section className="leaderboard-panel">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Team Name</th>
            <th>Lap 1 Time</th>
            <th>Lap 2 Time</th>
            <th>Total Time</th>
          </tr>
        </thead>
        <tbody>
          {completed.map((t) => (
            <LeaderboardRow key={t.teamId ?? t.teamName} team={t} />
          ))}
        </tbody>
      </table>

      {incomplete.length > 0 && (
        <div className="incomplete-section">
          <h3 className="incomplete-title">Incomplete Teams</h3>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Team Name</th>
                <th>Lap 1 Time</th>
                <th>Lap 2 Time</th>
                <th>Total Time</th>
              </tr>
            </thead>
            <tbody>
              {incomplete.map((t) => (
                <LeaderboardRow key={t.teamId ?? t.teamName} team={{ ...t, position: '--' }} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}