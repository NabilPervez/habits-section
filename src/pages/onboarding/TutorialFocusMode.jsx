import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MoreVertical, CheckCircle2, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import Icon from '../../components/Icon';
import { TUTORIAL_TASKS } from '../../data/seedData';
import { playSuccessSound, playXPSound } from '../../utils/sounds';

export default function TutorialFocusMode({ onComplete, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [totalXP, setTotalXP] = useState(0);

  const task = TUTORIAL_TASKS[currentStep];
  const totalSteps = TUTORIAL_TASKS.length;
  const progress = ((currentStep + (showCelebration ? 1 : 0)) / totalSteps) * 100;

  const triggerHaptic = () => {
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleDone = () => {
    triggerHaptic();
    playSuccessSound();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#1db954', '#ffd700', '#121212'],
    });
    setTotalXP(prev => prev + 10);
    setShowCelebration(true);
    setTimeout(playXPSound, 300);
  };

  const handleNext = () => {
    setShowCelebration(false);
    if (currentStep + 1 >= totalSteps) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg)',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px var(--space-gutter)', borderBottom: '1px solid var(--color-border)',
      }}>
        <button onClick={onClose} style={{ color: 'var(--color-primary)' }}><X size={24} /></button>
        <span style={{ font: 'var(--text-label-bold)', fontSize: 16, letterSpacing: '0.1em', color: 'var(--color-primary)' }}>
          FOCUS MODE
        </span>
        <button style={{ color: 'var(--color-text-muted)' }}><MoreVertical size={24} /></button>
      </div>

      {/* Progress */}
      <div style={{ padding: '16px var(--space-gutter)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ font: 'var(--text-label-bold)', fontSize: 16 }}>Tutorial: Step {currentStep + 1}</span>
          <span style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-secondary)' }}>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showCelebration ? (
          /* Task Card */
          <motion.div
            key={`task-${currentStep}`}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 var(--space-gutter)' }}
          >
            {/* Card */}
            <div className="card" style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              marginTop: 16, marginBottom: 24, maxHeight: 420,
            }}>
              {/* Icon circle */}
              <div style={{
                width: 120, height: 120, borderRadius: '50%',
                background: 'var(--color-primary-light)',
                border: '3px solid rgba(29, 185, 84, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 32,
              }}>
                <Icon name={task.icon} size={48} color="var(--color-primary)" />
              </div>

              {/* Task name */}
              <h2 style={{ font: 'var(--text-display)', marginBottom: 12 }}>{task.title}</h2>
              <p style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)', maxWidth: 280 }}>
                {task.description}
              </p>

              <p style={{
                font: 'var(--text-label-xs)', color: 'var(--color-text-muted)',
                letterSpacing: '0.15em', marginTop: 32,
              }}>
                ‹ SWIPE TO COMPLETE ›
              </p>
            </div>

            {/* Buttons */}
            <div style={{ paddingBottom: 'var(--space-2xl)' }}>
              <motion.button
                whileTap={{ scale: 0.93 }}
                className="btn-primary"
                onClick={handleDone}
                id="btn-done"
                style={{ fontSize: 20, padding: '22px', fontWeight: 800 }}
              >
                DONE <CheckCircle2 size={24} />
              </motion.button>
              <button
                className="btn-ghost"
                onClick={handleNext}
                style={{ width: '100%', marginTop: 12 }}
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        ) : (
          /* Celebration */
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '0 var(--space-gutter)',
              background: 'linear-gradient(180deg, #edfcf2 0%, #ffffff 60%)',
            }}
          >
            {/* Floating particles */}
            {[
              { color: '#ffd700', size: 8, top: '15%', left: '25%' },
              { color: '#1db954', size: 12, top: '20%', right: '20%' },
              { color: '#ffd700', size: 10, top: '30%', left: '70%' },
              { color: '#9e9e9e', size: 6, top: '25%', right: '30%' },
              { color: '#1db954', size: 8, bottom: '40%', left: '15%' },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.7 }}
                transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
                style={{
                  position: 'absolute', width: p.size, height: p.size,
                  borderRadius: '50%', background: p.color,
                  top: p.top, left: p.left, right: p.right, bottom: p.bottom,
                }}
              />
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              style={{
                width: 100, height: 100, borderRadius: '50%',
                background: 'var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 24,
                boxShadow: '0 8px 40px rgba(29, 185, 84, 0.3)',
              }}
            >
              <CheckCircle2 size={48} color="white" />
            </motion.div>

            <h2 style={{ font: 'var(--text-display)', marginBottom: 12 }}>DONE!</h2>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="chip chip--gold"
              style={{ fontSize: 14, padding: '10px 20px', marginBottom: 48 }}
            >
              ⭐ +10 XP
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
              onClick={handleNext}
              style={{ maxWidth: 360 }}
            >
              Next Task <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
