import React, { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import Round2Fixture from './components/Round2Fixture';
import Footer from './components/Footer';
import { getRound2Qualifiers } from './utils/leaderboardUtils';
import './styles.css';

const POLL_INTERVAL = 3000;

export default function App() {
  const [data, setData] = useState(null);
  const [qualifiers, setQualifiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}leaderboard.json`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json || !Array.isArray(json.results)) throw new Error('Invalid JSON structure');
      setQualifiers(getRound2Qualifiers(json.results, 16));
      setData(json);
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

          <Round2Fixture qualifiers={qualifiers} />

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