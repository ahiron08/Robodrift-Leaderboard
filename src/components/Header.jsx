import React from 'react';

export default function Header({ event, competition }) {
  return (
    <header className="header">
      <div className="header-brand">ROBOTRON 2026</div>
      <h1 className="header-title">ROBODRIFT LEADERBOARD</h1>
      <p className="header-subtitle">LIVE RACE STANDINGS</p>
      <div className="header-event">
        {event || 'ROBOTRON 2026'} · {competition || 'ROBODRIFT'}
      </div>
    </header>
  );
}