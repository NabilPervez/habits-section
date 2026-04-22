import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Layers, Sunrise, MapPin, Sliders, Trash2, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { getSetting, setSetting } from '../../db';
import { seedStandardSections, seedIslamicSections, seedCustomSections } from '../../data/seedData';
import { fullGeoFlow, buildIslamicSections } from '../../utils/geo';

export default function DayDivisionScreen({ onNext, onBack, onSkip, isEditing }) {
  const [selected, setSelected] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [customSections, setCustomSections] = useState([
    { id: uuidv4(), name: 'Morning', startTime: '06:00', endTime: '12:00', icon: 'sunrise', order: 0 },
    { id: uuidv4(), name: 'Afternoon', startTime: '12:00', endTime: '18:00', icon: 'sun', order: 1 }
  ]);

  useEffect(() => {
    async function loadCurrent() {
      if (isEditing) {
        const dd = await getSetting('dayDivision');
        if (dd) setSelected(dd);
      }
    }
    loadCurrent();
  }, [isEditing]);

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
    } else if (selected === 'custom') {
      // Re-assign order based on array position before saving
      const orderedCustomSections = customSections.map((sec, index) => ({
        ...sec,
        order: index
      }));
      await seedCustomSections(orderedCustomSections);
      await setSetting('city', 'Dallas, TX'); // Default
    } else {
      await seedStandardSections();
      await setSetting('city', 'Dallas, TX'); // Default
    }

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
        <span className="onboard-topbar__brand">{isEditing ? 'EDIT DAY DIVISION' : 'HABITFLOW'}</span>
        {!isEditing && <button className="onboard-topbar__skip" onClick={onSkip} disabled={loading}>Skip</button>}
      </div>

      {/* Progress */}
      {!isEditing && (
        <div style={{ padding: '0 var(--space-gutter)' }}>
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: '50%' }} />
          </div>
        </div>
      )}

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
            marginBottom: 16,
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

        {/* Fully Custom Option */}
        <div
          className={`card ${selected === 'custom' ? 'card--active' : ''}`}
          style={{
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
          }}
          id="option-custom"
        >
          <button
            onClick={() => setSelected('custom')}
            disabled={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, marginBottom: selected === 'custom' ? 16 : 0, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: selected === 'custom' ? 'var(--color-primary)' : 'var(--color-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sliders size={24} color={selected === 'custom' ? 'white' : 'var(--color-text-secondary)'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--text-label-bold)', fontSize: 16, marginBottom: 4 }}>Fully Custom</div>
              <div style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)', fontSize: 14 }}>Create your own sections</div>
            </div>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              border: selected === 'custom' ? 'none' : '2px solid var(--color-border)',
              background: selected === 'custom' ? 'var(--color-primary)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {selected === 'custom' && <span style={{ color: 'white', fontSize: 14 }}>✓</span>}
            </div>
          </button>

          {selected === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}
            >
              {customSections.map((sec, i) => (
                <div key={sec.id} style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--color-surface)', padding: '12px 16px', borderRadius: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 8 }}>
                    <input
                      type="text"
                      value={sec.name}
                      onChange={(e) => {
                        const updated = [...customSections];
                        updated[i].name = e.target.value;
                        setCustomSections(updated);
                      }}
                      placeholder="Section Name"
                      style={{ background: 'transparent', border: 'none', font: 'var(--text-label-bold)', fontSize: 16, color: 'var(--color-text)', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="time"
                        value={sec.startTime}
                        onChange={(e) => {
                          const updated = [...customSections];
                          updated[i].startTime = e.target.value;
                          setCustomSections(updated);
                        }}
                        style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 6, padding: '4px 8px', font: 'var(--text-body-md)', color: 'var(--color-text-secondary)', outline: 'none' }}
                      />
                      <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                      <input
                        type="time"
                        value={sec.endTime}
                        onChange={(e) => {
                          const updated = [...customSections];
                          updated[i].endTime = e.target.value;
                          setCustomSections(updated);
                        }}
                        style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 6, padding: '4px 8px', font: 'var(--text-body-md)', color: 'var(--color-text-secondary)', outline: 'none' }}
                      />
                    </div>
                  </div>
                  {customSections.length > 1 && (
                    <button
                      onClick={() => setCustomSections(customSections.filter(s => s.id !== sec.id))}
                      style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={20} color="var(--color-danger)" />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={() => setCustomSections([...customSections, { id: uuidv4(), name: 'New Section', startTime: '18:00', endTime: '22:00', icon: 'clock', order: customSections.length }])}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: 12, background: 'var(--color-surface)', borderRadius: 12,
                  border: '1px dashed var(--color-border)', color: 'var(--color-primary)',
                  font: 'var(--text-label-bold)', cursor: 'pointer'
                }}
              >
                <Plus size={20} />
                Add Section
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: 'var(--space-lg) var(--space-gutter)', paddingBottom: 'var(--space-2xl)' }}>
        <motion.button whileTap={{ scale: 0.95 }} className="btn-primary" onClick={handleContinue} disabled={loading} id="btn-division-continue">
          {loading ? 'Setting up...' : (isEditing ? 'Save' : 'Continue')} {!isEditing && <ChevronLeft size={18} style={{ transform: 'rotate(180deg)' }} />}
        </motion.button>
      </div>
    </motion.div>
  );
}
