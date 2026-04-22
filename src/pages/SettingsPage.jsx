import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pencil, RefreshCw, Upload, ExternalLink } from 'lucide-react';
import { getSetting, setSetting } from '../db';
import { fullGeoFlow } from '../utils/geo';

export default function SettingsPage({ navigate }) {
  const [haptics, setHaptics] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [geo, setGeo] = useState(true);
  const [wakeTime, setWakeTime] = useState('06:00');
  const [sleepTime, setSleepTime] = useState('22:00');
  const [dayDivision, setDayDivision] = useState('standard');
  const [city, setCity] = useState('Dallas, TX');
  const [refreshingGeo, setRefreshingGeo] = useState(false);

  useEffect(() => {
    async function load() {
      const h = await getSetting('haptics');
      const s = await getSetting('sounds');
      const g = await getSetting('geo');
      const w = await getSetting('wakeTime');
      const sl = await getSetting('sleepTime');
      const dd = await getSetting('dayDivision');
      const c = await getSetting('city');
      if (h !== null) setHaptics(h);
      if (s !== null) setSounds(s);
      if (g !== null) setGeo(g);
      if (w) setWakeTime(w);
      if (sl) setSleepTime(sl);
      if (dd) setDayDivision(dd);
      if (c) setCity(c);
    }
    load();
  }, []);

  const toggleSetting = async (key, current, setter) => {
    const val = !current;
    setter(val);
    await setSetting(key, val);
  };

  const handleRefreshGeo = async () => {
    if (!geo) return;
    setRefreshingGeo(true);
    try {
      const { cityName } = await fullGeoFlow();
      setCity(cityName);
    } catch (e) {
      console.warn(e);
    }
    setRefreshingGeo(false);
  };

  const formatTime12 = (time) => {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const Toggle = ({ active, onToggle }) => (
    <button
      className={`toggle ${active ? 'toggle--active' : ''}`}
      onClick={onToggle}
    >
      <div className="toggle__knob" />
    </button>
  );

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '20px var(--space-gutter) 24px',
      }}>
        <h1 style={{ font: 'var(--text-headline-lg)' }}>Settings</h1>
      </div>

      <div style={{ padding: '0 var(--space-gutter)' }}>
        {/* ROUTINE SCHEDULE */}
        <p style={{ font: 'var(--text-label-xs)', letterSpacing: '0.15em', color: 'var(--color-text-muted)', marginBottom: 12 }}>
          ROUTINE SCHEDULE
        </p>
        <div className="card" style={{ padding: 0, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid var(--color-border)',
          }}>
            <div>
              <p style={{ font: 'var(--text-body-md)', fontWeight: 500 }}>Waking Window</p>
              <p style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                {formatTime12(wakeTime)} - {formatTime12(sleepTime)}
              </p>
            </div>
            <Pencil size={18} color="var(--color-text-muted)" />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
          }}>
            <div>
              <p style={{ font: 'var(--text-body-md)', fontWeight: 500 }}>Day Division</p>
              <p style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                {dayDivision === 'islamic' ? 'Islamic' : 'Custom'}
              </p>
            </div>
            <ChevronRight size={18} color="var(--color-text-muted)" />
          </div>
        </div>

        {/* EXPERIENCE */}
        <p style={{ font: 'var(--text-label-xs)', letterSpacing: '0.15em', color: 'var(--color-text-muted)', marginBottom: 12 }}>
          EXPERIENCE
        </p>
        <div className="card" style={{ padding: 0, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid var(--color-border)',
          }}>
            <span style={{ font: 'var(--text-body-md)', fontWeight: 500 }}>Haptic Feedback</span>
            <Toggle active={haptics} onToggle={() => toggleSetting('haptics', haptics, setHaptics)} />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
          }}>
            <span style={{ font: 'var(--text-body-md)', fontWeight: 500 }}>Sound Effects</span>
            <Toggle active={sounds} onToggle={() => toggleSetting('sounds', sounds, setSounds)} />
          </div>
        </div>

        {/* LOCATION & DATA */}
        <p style={{ font: 'var(--text-label-xs)', letterSpacing: '0.15em', color: 'var(--color-text-muted)', marginBottom: 12 }}>
          LOCATION & DATA
        </p>
        <div className="card" style={{ padding: 0, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid var(--color-border)',
          }}>
            <div>
              <p style={{ font: 'var(--text-body-md)', fontWeight: 500 }}>Geolocation</p>
              <p style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                For prayer times & pacing accuracy
              </p>
            </div>
            <Toggle active={geo} onToggle={() => toggleSetting('geo', geo, setGeo)} />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid var(--color-border)',
          }}>
            <div>
              <p style={{ font: 'var(--text-body-md)', fontWeight: 500 }}>Current City</p>
              <p style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>{city}</p>
            </div>
            <button onClick={handleRefreshGeo} disabled={!geo || refreshingGeo}>
              <RefreshCw size={18} color={geo ? 'var(--color-primary)' : 'var(--color-text-muted)'} className={refreshingGeo ? 'spinning' : ''} />
            </button>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <button style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '12px',
              background: 'var(--color-surface)', borderRadius: 12,
              font: 'var(--text-label-bold)', color: 'var(--color-text-secondary)',
            }}>
              <Upload size={16} /> Backup my data
            </button>
          </div>
        </div>

        {/* ABOUT */}
        <p style={{ font: 'var(--text-label-xs)', letterSpacing: '0.15em', color: 'var(--color-text-muted)', marginBottom: 12 }}>
          ABOUT
        </p>
        <div className="card" style={{ padding: 0, marginBottom: 16, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid var(--color-border)',
          }}>
            <span style={{ font: 'var(--text-body-md)', fontWeight: 500 }}>Version</span>
            <span style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-muted)' }}>1.0.0</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid var(--color-border)',
          }}>
            <span style={{ font: 'var(--text-body-md)', fontWeight: 500 }}>Privacy Policy</span>
            <ExternalLink size={16} color="var(--color-text-muted)" />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
          }}>
            <span style={{ font: 'var(--text-body-md)', fontWeight: 500 }}>Terms of Service</span>
            <ExternalLink size={16} color="var(--color-text-muted)" />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32, marginBottom: 48 }}>
          <a
            href="https://nabilpervezconsulting.com/offer"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              font: 'var(--text-label-sm)', color: 'var(--color-text-muted)',
              textDecoration: 'underline', textUnderlineOffset: 4,
            }}
          >
            Built by Nabil Pervez Consulting
          </a>
        </div>
      </div>
    </div>
  );
}
