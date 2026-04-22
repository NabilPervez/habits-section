import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Layers, Sunrise, MapPin } from 'lucide-react';
import { setSetting } from '../../db';
import { seedStandardSections, seedIslamicSections, seedHistoricalData } from '../../data/seedData';
import { fullGeoFlow, buildIslamicSections } from '../../utils/geo';

export default function DayDivisionScreen({ onNext, onBack, onSkip }) {
  const [selected, setSelected] = useState('standard');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    await setSetting('dayDivision', selected);

    if (selected === 'islamic') {
      try {
        const { prayerTimes } = await fullGeoFlow();
        const sections = buildIslamicSections(prayerTimes);
        await seedIslamicSections(sections);
      } catch (e) {
        // Fallback to standard if geo fails entirely
        await seedStandardSections();
      }
    } else {
      await seedStandardSections();
      await setSetting('city', 'Dallas, TX'); // Default
    }

    await seedHistoricalData();
    setLoading(false);
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Top bar */}
      <div className="onboard-topbar">
        <button className="onboard-topbar__back" onClick={onBack} disabled={loading}><ChevronLeft size={24} /></button>
        <span className="onboard-topbar__brand">HABITFLOW</span>
        <button className="onboard-topbar__skip" onClick={onSkip} disabled={loading}>Skip</button>
      </div>

      {/* Progress */}
      <div style={{ padding: '0 var(--space-gutter)' }}>
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: '50%' }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--space-2xl) var(--space-gutter)', flex: 1 }}>
        <h1 style={{ font: 'var(--text-headline-md)', marginBottom: 8 }}>How do you want to divide your day?</h1>
        <p style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)', marginBottom: 32 }}>
          You can always change this later.
        </p>

        {/* Standard Blocks */}
        <button
          onClick={() => setSelected('standard')}
          className={`card ${selected === 'standard' ? 'card--active' : ''}`}
          style={{
            width: '100%',
            textAlign: 'left',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer',
          }}
          disabled={loading}
          id="option-standard"
        >
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'var(--color-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Layers size={24} color="var(--color-text-secondary)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ font: 'var(--text-label-bold)', fontSize: 16, marginBottom: 4 }}>Standard Blocks</div>
            <div style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)', fontSize: 14 }}>Morning, Work, Evening</div>
          </div>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            border: selected === 'standard' ? 'none' : '2px solid var(--color-border)',
            background: selected === 'standard' ? 'var(--color-primary)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {selected === 'standard' && <span style={{ color: 'white', fontSize: 14 }}>✓</span>}
          </div>
        </button>

        {/* Islamic Preset */}
        <button
          onClick={() => setSelected('islamic')}
          className={`card ${selected === 'islamic' ? 'card--active' : ''}`}
          style={{
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
          }}
          disabled={loading}
          id="option-islamic"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: selected === 'islamic' ? 16 : 0 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: selected === 'islamic' ? 'var(--color-primary)' : 'var(--color-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sunrise size={24} color={selected === 'islamic' ? 'white' : 'var(--color-text-secondary)'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--text-label-bold)', fontSize: 16, marginBottom: 4 }}>Islamic Preset</div>
              <div style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)', fontSize: 14 }}>Sync routines with prayer times</div>
            </div>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              border: selected === 'islamic' ? 'none' : '2px solid var(--color-border)',
              background: selected === 'islamic' ? 'var(--color-primary)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {selected === 'islamic' && <span style={{ color: 'white', fontSize: 14 }}>✓</span>}
            </div>
          </div>
          {selected === 'islamic' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                background: 'var(--color-surface)', borderRadius: 12, marginTop: 8,
              }}
            >
              <MapPin size={18} color="var(--color-text-muted)" />
              <span style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)', fontSize: 13, flex: 1 }}>
                Will request location access to calculate accurate daily prayer times.
              </span>
            </motion.div>
          )}
        </button>
      </div>

      {/* CTA */}
      <div style={{ padding: 'var(--space-lg) var(--space-gutter)', paddingBottom: 'var(--space-2xl)' }}>
        <motion.button whileTap={{ scale: 0.95 }} className="btn-primary" onClick={handleContinue} disabled={loading} id="btn-division-continue">
          {loading ? 'Setting up...' : 'Continue'} <ChevronLeft size={18} style={{ transform: 'rotate(180deg)' }} />
        </motion.button>
      </div>
    </motion.div>
  );
}
