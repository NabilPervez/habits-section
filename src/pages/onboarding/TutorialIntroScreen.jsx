import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Droplets, PersonStanding, Smile } from 'lucide-react';

const previewTasks = [
  { title: 'Drink Water', desc: 'Start your engine.', Icon: Droplets, step: 'STEP 1', active: true },
  { title: 'Stretch', desc: 'Wake up those muscles.', Icon: PersonStanding },
  { title: 'Smile', desc: 'Lock in the good vibes.', Icon: Smile },
];

export default function TutorialIntroScreen({ onNext, onBack, onSkip }) {
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

      {/* Progress */}
      <div style={{ padding: '0 var(--space-gutter)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="progress-bar" style={{ flex: 1 }}>
            <div className="progress-bar__fill" style={{ width: '80%' }} />
          </div>
          <span style={{ font: 'var(--text-label-bold)', color: 'var(--color-text-secondary)' }}>80%</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--space-2xl) var(--space-gutter)', flex: 1 }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ font: 'var(--text-display)', textAlign: 'center', marginBottom: 16 }}
        >
          Experience the Flow
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 40 }}
        >
          Tap <strong>Try Tutorial</strong> to see how we guide you one task at a time.
        </motion.p>

        {/* Task preview list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {previewTasks.map((task, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`card ${task.active ? 'card--active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: task.active ? 'var(--color-primary)' : 'var(--color-surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <task.Icon size={22} color={task.active ? 'white' : 'var(--color-text-muted)'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: 'var(--text-label-bold)', fontSize: 16 }}>{task.title}</div>
                <div style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>{task.desc}</div>
              </div>
              {task.step && (
                <span className="chip" style={{ fontSize: 11 }}>{task.step}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: 'var(--space-lg) var(--space-gutter)', paddingBottom: 'var(--space-2xl)' }}>
        <motion.button whileTap={{ scale: 0.95 }} className="btn-primary" onClick={onNext} id="btn-try-tutorial">
          Try Tutorial <ChevronRight size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}
