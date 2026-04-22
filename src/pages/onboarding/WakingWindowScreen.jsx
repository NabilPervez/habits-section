import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { setSetting } from '../../db';

export default function WakingWindowScreen({ onNext, onBack, onSkip }) {
  const [wakeHour, setWakeHour] = useState(7);
  const [wakeMinute, setWakeMinute] = useState(0);
  const [wakeAmPm, setWakeAmPm] = useState('AM');
  const [sleepHour, setSleepHour] = useState(11);
  const [sleepMinute, setSleepMinute] = useState(30);
  const [sleepAmPm, setSleepAmPm] = useState('PM');

  const formatTime = (h, m, ampm) => {
    const h24 = ampm === 'PM' && h !== 12 ? h + 12 : (ampm === 'AM' && h === 12 ? 0 : h);
    return `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleNext = async () => {
    await setSetting('wakeTime', formatTime(wakeHour, wakeMinute, wakeAmPm));
    await setSetting('sleepTime', formatTime(sleepHour, sleepMinute, sleepAmPm));
    onNext();
  };

  const TimeInput = ({ label, icon, hour, setHour, minute, setMinute, ampm, setAmpm }) => (
    <div className="card" style={{ marginBottom: 16, padding: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="number"
            min={1} max={12}
            value={String(hour).padStart(2, '0')}
            onChange={(e) => setHour(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
            style={{
              width: 80,
              font: 'var(--text-display)',
              color: 'var(--color-primary)',
              textAlign: 'center',
              background: 'transparent',
            }}
          />
          <span style={{ font: 'var(--text-display)', color: 'var(--color-text-muted)' }}>:</span>
          <input
            type="number"
            min={0} max={59}
            value={String(minute).padStart(2, '0')}
            onChange={(e) => setMinute(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            style={{
              width: 80,
              font: 'var(--text-display)',
              color: 'var(--color-primary)',
              textAlign: 'center',
              background: 'transparent',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 0, marginLeft: 'auto' }}>
          {['AM', 'PM'].map(v => (
            <button
              key={v}
              onClick={() => setAmpm(v)}
              style={{
                padding: '10px 16px',
                font: 'var(--text-label-bold)',
                background: ampm === v ? 'var(--color-surface)' : 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: v === 'AM' ? '8px 0 0 8px' : '0 8px 8px 0',
                color: ampm === v ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Top bar */}
      <div className="onboard-topbar">
        <button className="onboard-topbar__back" onClick={onBack}><ChevronLeft size={24} /></button>
        <span className="onboard-topbar__brand">HABITFLOW</span>
        <button className="onboard-topbar__skip" onClick={onSkip}>Skip</button>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '0 var(--space-gutter)' }}>
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: '25%' }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--space-2xl) var(--space-gutter)', flex: 1 }}>
        <h1 style={{ font: 'var(--text-headline-lg)', marginBottom: 8 }}>When does your day start?</h1>
        <p style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)', marginBottom: 32 }}>
          We'll use this to pace your routines.
        </p>

        <TimeInput
          label="I wake up at..."
          icon="🌱"
          hour={wakeHour} setHour={setWakeHour}
          minute={wakeMinute} setMinute={setWakeMinute}
          ampm={wakeAmPm} setAmpm={setWakeAmPm}
        />
        <TimeInput
          label="I sleep at..."
          icon="🌙"
          hour={sleepHour} setHour={setSleepHour}
          minute={sleepMinute} setMinute={setSleepMinute}
          ampm={sleepAmPm} setAmpm={setSleepAmPm}
        />
      </div>

      {/* CTA */}
      <div style={{ padding: 'var(--space-lg) var(--space-gutter)', paddingBottom: 'var(--space-2xl)' }}>
        <motion.button whileTap={{ scale: 0.95 }} className="btn-primary" onClick={handleNext} id="btn-waking-next">
          Next
        </motion.button>
      </div>
    </motion.div>
  );
}
