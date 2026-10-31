import React, { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import Leaderboard from './components/Leaderboard';
import Footer from './components/Footer';
import { getRound2Qualifiers, sortLeaderboard, assignPositions } from './utils/leaderboardUtils';
import './styles.css';

const POLL_INTERVAL = 3000;

export default function App() {
  const [data, setData] = useState(null);
  const [qualifiers, setQualifiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [round2Data, setRound2Data] = useState(null);

  const fetchData = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}leaderboard.json`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json || !Array.isArray(json.results)) throw new Error('Invalid JSON structure');
      setQualifiers(getRound2Qualifiers(json.results, 16));
      setData(json);
      // round 2 leaderboard (optional)
      try {
        const r2 = await fetch(`${import.meta.env.BASE_URL}leaderboard2.json`, { cache: 'no-store' });
        if (r2.ok) {
          const j2 = await r2.json();
          setRound2Data(j2);
        }
      } catch (e) {}
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(() => fetchData(), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchData]);

  return (
    <div className="app">
      <div className="bg-grid" />
      <div className="scanlines" />
      <Header event={data?.event} competition={data?.competition} />

      <main className="main">
        {loading && <div className="status loading">Loading leaderboard…</div>}
        {error && <div className="status error">Error: {error}</div>}

        {!loading && !error && (
           <>

          {round2Data && Array.isArray(round2Data.results) && round2Data.results.length > 0 && (() => { const { completed, incomplete } = sortLeaderboard(round2Data.results); return <Leaderboard completed={assignPositions(completed)} incomplete={incomplete} />; })()}


           </>

        )}

        <div className="status-bar">
          <span className="last-updated">
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '--'}
          </span>
          <span className="auto-indicator">
            <span className="pulse" /> Auto-refresh every 3s
          </span>
          <button className="refresh-btn" onClick={() => fetchData(true)} disabled={refreshing}>
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
