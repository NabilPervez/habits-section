import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessSound } from '../utils/sounds';

export default function AchievementToast({ achievement, onClose }) {
  useEffect(() => {
    if (achievement) {
      playSuccessSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.2 },
        colors: ['#ffd700', '#1db954', '#ffffff']
      });

      const timer = setTimeout(() => {
        onClose();
      }, 4000); // close after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--color-surface-elevated)',
          border: '1px solid var(--color-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 8px 30px rgba(255, 215, 0, 0.2)',
          zIndex: 1000,
          minWidth: '300px'
        }}
      >
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--color-gold-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Award size={24} color="#B8960F" style={{ fill: '#FFD700' }} />
        </div>
        <div>
          <p style={{ font: 'var(--text-label-xs)', color: 'var(--color-gold-text)', letterSpacing: '0.1em', marginBottom: 2 }}>
            ACHIEVEMENT UNLOCKED
          </p>
          <p style={{ font: 'var(--text-headline-sm)', color: 'var(--color-text-primary)' }}>
            {achievement.title}
          </p>
          <p style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
            +{achievement.xpBonus} XP
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
