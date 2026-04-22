import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronRight, CheckCircle2, Zap, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SectionSummary({ data, onReturn }) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.3 },
      colors: ['#1db954', '#ffd700', '#121212'],
    });
  }, []);

  if (!data) return null;

  const { section, completedTasks, totalXP, isPerfect, skippedCount } = data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-gutter)',
      }}
    >
      {/* Hero */}
      <div className="card" style={{
        textAlign: 'center',
        padding: '40px 24px',
        marginBottom: 24,
        background: 'linear-gradient(180deg, #edfcf2 0%, #ffffff 70%)',
      }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 30px rgba(29, 185, 84, 0.3)',
          }}
        >
          <Award size={40} color="white" />
        </motion.div>

        <h1 style={{ font: 'var(--text-display)', marginBottom: 8 }}>Section Mastered!</h1>
        <p style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)' }}>
          {section?.name} Routine Complete
        </p>
      </div>

      {/* XP Earned */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <span style={{ font: 'var(--text-label-bold)', fontSize: 16 }}>Total XP Earned</span>
        <span style={{ font: 'var(--text-headline-lg)', color: 'var(--color-primary)' }}>+{totalXP} XP</span>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {isPerfect && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="chip chip--gold"
            style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: 13 }}
          >
            <Zap size={14} /> 2x Perfect Combo
          </motion.div>
        )}
        <div className="chip" style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: 13 }}>
          <Clock size={14} /> +50 Early Bird
        </div>
      </div>

      {/* Completed tasks */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: 20,
        marginBottom: 24,
      }}>
        <h3 style={{ font: 'var(--text-label-xs)', letterSpacing: '0.15em', color: 'var(--color-text-muted)', marginBottom: 16 }}>
          COMPLETED TASKS
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {completedTasks.map((task, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="card"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
              }}
            >
              <CheckCircle2 size={24} color="var(--color-primary)" />
              <span style={{ font: 'var(--text-body-md)', flex: 1 }}>{task.title}</span>
              <span style={{ font: 'var(--text-label-bold)', color: 'var(--color-primary)' }}>+{task.xpEarned} XP</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginTop: 'auto', paddingBottom: 'var(--space-lg)' }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="btn-primary"
          onClick={onReturn}
          id="btn-return-timeline"
        >
          Return to Timeline <ChevronRight size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}
