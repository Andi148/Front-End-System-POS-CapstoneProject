import { useState, useEffect } from 'react';
import { Clock, Store, ShieldCheck, Bell } from 'lucide-react';
import { usePos } from '../context/PosContext';

export default function Navbar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = time.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="pos-top-navbar">
      <div className="navbar-left">
        <div className="status-chip">
          <span className="live-pulsing-dot"></span>
          <span>Outlet Buka • Kasir Aktif</span>
        </div>
        <span className="store-location-text">Cabang Utama Diponegoro</span>
      </div>

      <div className="navbar-right">
        <div className="datetime-display">
          <Clock size={16} className="clock-icon" />
          <span className="time-val">{formattedTime}</span>
          <span className="date-sep">•</span>
          <span className="date-val">{formattedDate}</span>
        </div>
      </div>
    </header>
  );
}
