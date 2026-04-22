import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MoreVertical, CheckCircle2, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getTasksForSection, getSections, completeTask, getTodayHistory, getSetting } from '../db';
import Icon from '../components/Icon';
import { playSuccessSound, playXPSound, playSectionCompleteSound, playSkipSound } from '../utils/sounds';

export default function FocusMode({ sectionId, onComplete, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [section, setSection] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [skippedCount, setSkippedCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    async function load() {
      const soundsOn = await getSetting('sounds');
      if (soundsOn !== null) setSoundEnabled(soundsOn);

      const sections = await getSections();
      const sec = sections.find(s => s.id === sectionId);
      setSection(sec);

      const allTasks = await getTasksForSection(sectionId);
      const history = await getTodayHistory();
      // Filter out already completed tasks
      const remaining = allTasks.filter(t => !history.some(h => h.taskId === t.id && !h.skipped));
      setTasks(remaining.length > 0 ? remaining : allTasks);
    }
    load();
  }, [sectionId]);

  const task = tasks[currentIdx];
  const totalSteps = tasks.length;
  const progress = ((currentIdx + (showCelebration ? 1 : 0)) / totalSteps) * 100;

  const triggerHaptic = async () => {
    const hapticsOn = await getSetting('haptics') !== false;
    if (hapticsOn && navigator.vibrate) navigator.vibrate(50);
  };

  const handleDone = async () => {
    if (!task) return;
    triggerHaptic();
    if (soundEnabled) playSuccessSound();

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#1db954', '#ffd700', '#121212'],
    });

    const xp = await completeTask(task.id, sectionId, false);
    setCompletedTasks(prev => [...prev, { ...task, xpEarned: xp }]);
    setShowCelebration(true);

    if (soundEnabled) setTimeout(playXPSound, 300);
  };

  const handleSkip = async () => {
    if (!task) return;
    if (soundEnabled) playSkipSound();
    await completeTask(task.id, sectionId, true);
    setSkippedCount(prev => prev + 1);
    advanceOrFinish();
  };

  const advanceOrFinish = () => {
    setShowCelebration(false);
    if (currentIdx + 1 >= totalSteps) {
      if (soundEnabled) setTimeout(playSectionCompleteSound, 200);
      // Section complete — compute summary
      const totalXP = completedTasks.reduce((s, t) => s + (t.xpEarned || 0), 0);
      const isPerfect = skippedCount === 0;
      onComplete({
        section,
        completedTasks,
        totalXP: isPerfect ? totalXP * 2 : totalXP,
        isPerfect,
        skippedCount,
      });
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handleNextTask = () => advanceOrFinish();

  if (!task && !showCelebration) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}
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
          <span style={{ font: 'var(--text-label-bold)', fontSize: 14 }}>
            STEP {currentIdx + 1} OF {totalSteps}
          </span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showCelebration ? (
          <motion.div
            key={`task-${currentIdx}`}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 var(--space-gutter)' }}
          >
            <div className="card" style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              marginTop: 16, marginBottom: 24, maxHeight: 420,
            }}>
              <div style={{
                width: 120, height: 120, borderRadius: '50%',
                background: 'var(--color-primary-light)',
                border: '3px solid rgba(29, 185, 84, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 32,
              }}>
                <Icon name={task?.icon || 'zap'} size={48} color="var(--color-primary)" />
              </div>
              <h2 style={{ font: 'var(--text-display)', marginBottom: 12 }}>{task?.title}</h2>
              {task?.durationMinutes > 0 && (
                <span className="chip" style={{ marginBottom: 12 }}>{task.durationMinutes}m</span>
              )}
              <p style={{ font: 'var(--text-label-xs)', color: 'var(--color-text-muted)', letterSpacing: '0.15em', marginTop: 24 }}>
                ‹ SWIPE TO COMPLETE ›
              </p>
            </div>

            <div style={{ paddingBottom: 'var(--space-2xl)' }}>
              <motion.button
                whileTap={{ scale: 0.93 }}
                className="btn-primary"
                onClick={handleDone}
                id="btn-focus-done"
                style={{ fontSize: 20, padding: '22px', fontWeight: 800 }}
              >
                DONE <CheckCircle2 size={24} />
              </motion.button>
              <button className="btn-ghost" onClick={handleSkip} style={{ width: '100%', marginTop: 12 }}>
                Skip for now
              </button>
            </div>
          </motion.div>
        ) : (
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
            {[
              { color: '#ffd700', size: 8, top: '15%', left: '25%' },
              { color: '#1db954', size: 12, top: '20%', right: '20%' },
              { color: '#ffd700', size: 10, top: '30%', left: '70%' },
              { color: '#9e9e9e', size: 6, top: '25%', right: '30%' },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.7 }}
                transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
                style={{
                  position: 'absolute', width: p.size, height: p.size,
                  borderRadius: '50%', background: p.color,
                  top: p.top, left: p.left, right: p.right,
                }}
              />
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              style={{
                width: 100, height: 100, borderRadius: '50%',
                background: 'var(--color-primary)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: 24,
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
              onClick={handleNextTask}
              style={{ maxWidth: 360 }}
            >
              {currentIdx + 1 >= totalSteps ? 'View Summary' : 'Next Task'} <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
