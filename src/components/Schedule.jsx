import React from 'react';
import './schedule.css';

const SLOTS = [
  { slot: '01', time: '8:30 AM – 8:40 AM', team: "Smartpahls" },
  { slot: '02', time: '8:40 AM – 8:50 AM', team: "Nitro Bots" },
  { slot: '03', time: '8:50 AM – 9:00 AM', team: "Pace Chasers" },
  { slot: '04', time: '9:00 AM – 9:10 AM', team: "Trailblazer's" },
  { slot: '05', time: '9:10 AM – 9:20 AM', team: "Nyx" },
  { slot: '06', time: '9:20 AM – 9:30 AM', team: "GerminaNova-1" },
  { slot: '07', time: '9:30 AM – 9:40 AM', team: "Steel troops" },
  { slot: '08', time: '9:40 AM – 9:50 AM', team: "Roboracers" },
  { slot: '09', time: '9:50 AM – 10:00 AM', team: "ROBONIX" },
  { slot: '10', time: '10:00 AM – 10:10 AM', team: "4HM" },
  { slot: '11', time: '10:10 AM – 10:20 AM', team: "The Redline Drift" },
  { slot: '12', time: '10:20 AM – 10:30 AM', team: "Caffeinated" },
  { slot: '13', time: '10:30 AM – 10:40 AM', team: "Team phoenix" },
  { slot: '14', time: '10:40 AM – 10:50 AM', team: "Autobots" },
  { slot: '15', time: '10:50 AM – 11:00 AM', team: "Geared Brothers" },
  { slot: '16', time: '11:00 AM – 11:10 AM', team: "Malai chap extra" },
  { slot: '17', time: '11:10 AM – 11:20 AM', team: "veg omlette" },
  { slot: '18', time: '11:20 AM – 11:30 AM', team: "Vessel" },
];

const CARDS = [
  '10 MIN PER TEAM',
  'ONE TEAM PER TIME SLOT',
  '8:30 AM – 12:00 PM SCHEDULE WINDOW',
  '11:30 AM SCHEDULED FINISH',
];

export default function Schedule() {
  const base = import.meta.env.BASE_URL;
  return (
    <section className="schedule-panel">
      <div className="schedule-heading">
        <h2>ROBOTRON 2026</h2>
        <h3>ROBODRIFT RACE SCHEDULE</h3>
        <p className="schedule-subtitle">REMAINING TEAMS • INDIVIDUAL TEAM SCHEDULE</p>
        <p className="schedule-date">Date: 31.10.26</p>
      </div>

      <div className="info-cards">
        {CARDS.map((c) => (
          <div className="info-card" key={c}>{c}</div>
        ))}
      </div>

      <table className="schedule-table">
        <thead>
          <tr>
            <th>Slot</th>
            <th>Time</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {SLOTS.map((s, i) => (
            <tr key={s.slot} className={i % 2 === 0 ? 'even' : 'odd'}>
              <td className="slot-num">{s.slot}</td>
              <td className="slot-time">{s.time}</td>
              <td className="slot-team">{s.team}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="schedule-note">
        "Team ZERO RESISTANCE has been removed following disqualification. Team phoenix is scheduled immediately after slot 13. Each team has a 10-minute slot."
      </p>

      <div className="pdf-actions">
        <a className="pdf-btn" href={`${base}robodrift-schedule.pdf`} target="_blank" rel="noreferrer">VIEW FULL SCHEDULE</a>
        <a className="pdf-btn" href={`${base}robodrift-schedule.pdf`} download>DOWNLOAD PDF</a>
      </div>

      <div className="pdf-viewer">
        <iframe src={`${base}robodrift-schedule.pdf`} title="Schedule PDF" />
      </div>
    </section>
  );
}
