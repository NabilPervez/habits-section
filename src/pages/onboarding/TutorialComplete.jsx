import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Award, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { setSetting } from '../../db';

export default function TutorialComplete({ onNext }) {
  React.useEffect(() => {
    // Fire confetti on mount
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.3 },
      colors: ['#1db954', '#ffd700', '#121212', '#24d160'],
    });
  }, []);

  const handleGoToTimeline = async () => {
    await setSetting('onboardingComplete', true);
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-gutter)',
        background: 'linear-gradient(180deg, #edfcf2 0%, #fffdf0 40%, #ffffff 70%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating confetti particles */}
      {[
        { color: '#1db954', size: 10, top: '8%', left: '20%', shape: 'circle' },
        { color: '#ffd700', size: 12, top: '12%', right: '25%', shape: 'square' },
        { color: '#9e9e9e', size: 6, top: '18%', left: '60%', shape: 'circle' },
        { color: '#ffd700', size: 8, top: '5%', right: '40%', shape: 'star' },
        { color: '#1db954', size: 8, bottom: '35%', left: '10%', shape: 'circle' },
        { color: '#9e9e9e', size: 14, bottom: '30%', right: '12%', shape: 'line', rotate: 30 },
        { color: '#ffd700', size: 10, bottom: '25%', left: '40%', shape: 'circle' },
        { color: '#1db954', size: 14, top: '15%', left: '8%', shape: 'line', rotate: -20 },
      ].map((p, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ delay: 0.3 + i * 0.08, type: 'spring' }}
          style={{
            position: 'absolute',
            width: p.shape === 'line' ? p.size * 2 : p.size,
            height: p.shape === 'line' ? 3 : p.size,
            borderRadius: p.shape === 'square' ? 2 : '50%',
            background: p.color,
            top: p.top, left: p.left, right: p.right, bottom: p.bottom,
            transform: p.rotate ? `rotate(${p.rotate}deg)` : undefined,
          }}
        />
      ))}

      {/* Medal */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 32,
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        }}
      >
        <Award size={48} color="var(--color-primary)" />
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ font: 'var(--text-display)', marginBottom: 12 }}
      >
        Routine Mastered!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)', marginBottom: 32 }}
      >
        You've successfully completed the setup. The groundwork is laid.
      </motion.p>

      {/* Multiplier badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="chip chip--gold"
        style={{ fontSize: 14, padding: '12px 24px', marginBottom: 24, fontWeight: 800, letterSpacing: '0.1em' }}
      >
        <Zap size={16} /> 2X MULTIPLIER
      </motion.div>

      {/* XP Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
        style={{ padding: '24px 40px', textAlign: 'center', marginBottom: 48, maxWidth: 300 }}
      >
        <p style={{ font: 'var(--text-label-xs)', letterSpacing: '0.15em', color: 'var(--color-text-muted)', marginBottom: 8 }}>
          TOTAL XP EARNED
        </p>
        <p style={{ font: 'var(--text-display)', color: 'var(--color-primary)' }}>
          30 <span style={{ fontSize: 20 }}>XP</span>
        </p>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileTap={{ scale: 0.95 }}
        className="btn-primary"
        onClick={handleGoToTimeline}
        id="btn-go-timeline"
        style={{ maxWidth: 360 }}
      >
        Go to Timeline <ChevronRight size={18} />
      </motion.button>
    </motion.div>
  );
}
