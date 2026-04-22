import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Play } from 'lucide-react';
import { getSections, getTasksForSection, getTodayHistory, calculateStats } from '../db';
import Icon from '../components/Icon';

export default function TimelinePage({ onStartRoutine }) {
  const [sections, setSections] = useState([]);
  const [tasksBySection, setTasksBySection] = useState({});
  const [todayHistory, setTodayHistory] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const s = await getSections();
    setSections(s);
    const tbys = {};
    for (const sec of s) {
      tbys[sec.id] = await getTasksForSection(sec.id);
    }
    setTasksBySection(tbys);
    setTodayHistory(await getTodayHistory());
    setStats(await calculateStats());
  }

  const now = new Date();
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const isSectionActive = (section) => {
    return currentTimeStr >= section.startTime;
  };

  const isSectionCompleted = (sectionId) => {
    const tasks = tasksBySection[sectionId] || [];
    if (tasks.length === 0) return false;
    return tasks.every(t => todayHistory.some(h => h.taskId === t.id && !h.skipped));
  };

  const isTaskDone = (taskId) => todayHistory.some(h => h.taskId === taskId && !h.skipped);

  const formatTime = (time) => {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const xpProgress = stats ? ((stats.totalXP - stats.xpForCurrentLevel) / (stats.xpForNextLevel - stats.xpForCurrentLevel)) * 100 : 0;

  return (
    <div className="page-content" style={{ paddingTop: 0 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px var(--space-gutter)',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', background: 'var(--color-surface)',
          border: '2px solid var(--color-border)', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>
          👤
        </div>
        <span style={{ font: 'var(--text-label-bold)', fontSize: 18, letterSpacing: '-0.01em' }}>HabitFlow</span>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="sprout" size={20} color="var(--color-primary)" />
        </div>
      </div>

      {/* Level + Streak Card */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{
            margin: '0 var(--space-gutter) var(--space-lg)',
            display: 'flex', alignItems: 'center', gap: 16,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ font: 'var(--text-headline-md)' }}>Level {stats.level}</span>
              <span style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-secondary)' }}>
                {stats.totalXP.toLocaleString()} / {stats.xpForNextLevel.toLocaleString()} XP
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar__fill" style={{ width: `${Math.min(100, xpProgress)}%` }} />
            </div>
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '8px 12px', borderRadius: 12,
            background: 'var(--color-gold-bg)',
          }}>
            <Flame size={22} color="#FF8C00" fill="#FFD700" />
            <span style={{ font: 'var(--text-label-bold)', color: '#FF8C00', fontSize: 16 }}>{stats.currentStreak} Day</span>
            <span style={{ font: 'var(--text-label-sm)', color: 'var(--color-gold-text)' }}>Streak</span>
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <div style={{ padding: '0 var(--space-gutter)', position: 'relative' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: 30, top: 0, bottom: 0,
          width: 2, background: 'var(--color-border)',
        }} />

        {sections.map((section, idx) => {
          const isActive = isSectionActive(section) && !isSectionCompleted(section.id);
          const isDone = isSectionCompleted(section.id);
          const tasks = tasksBySection[section.id] || [];

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                position: 'relative',
                paddingLeft: 40,
                marginBottom: 24,
              }}
            >
              {/* Timeline dot */}
              <div style={{
                position: 'absolute', left: 22, top: 20,
                width: 18, height: 18, borderRadius: '50%',
                background: isDone ? 'var(--color-primary)' : isActive ? 'var(--color-primary)' : 'var(--color-border)',
                border: isActive ? '3px solid var(--color-primary-light)' : 'none',
                zIndex: 2,
              }} />

              <div
                className={`card ${isActive ? 'card--active' : ''}`}
                style={{
                  opacity: !isActive && !isDone ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {/* Time chip + icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span className="chip" style={{
                    background: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: isActive ? 'white' : 'var(--color-text-secondary)',
                    border: isActive ? '1px solid var(--color-primary)' : undefined,
                    fontWeight: 700,
                  }}>
                    {formatTime(section.startTime)}
                  </span>
                  <Icon name={section.icon} size={24} color={isDone ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                </div>

                {/* Section name */}
                <h3 style={{ font: 'var(--text-headline-md)', fontSize: 22, marginBottom: 16 }}>
                  {section.name} {isDone && '✓'}
                </h3>

                {/* Task list */}
                {(isActive || isDone) && tasks.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: isActive ? 20 : 0 }}>
                    {tasks.map(task => (
                      <div key={task.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 14px', borderRadius: 10,
                        background: 'var(--color-surface)',
                      }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: 6,
                          border: isTaskDone(task.id) ? 'none' : '2px solid var(--color-border)',
                          background: isTaskDone(task.id) ? 'var(--color-primary)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {isTaskDone(task.id) && <span style={{ color: 'white', fontSize: 12 }}>✓</span>}
                        </div>
                        <span style={{
                          font: 'var(--text-body-md)',
                          textDecoration: isTaskDone(task.id) ? 'line-through' : 'none',
                          color: isTaskDone(task.id) ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                        }}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Start button (active section only) */}
                {isActive && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                    onClick={() => onStartRoutine(section.id)}
                    id={`btn-start-${section.id}`}
                  >
                    <Play size={18} fill="white" /> Start {section.name} Routine
                  </motion.button>
                )}

                {/* Inactive: show task names as chips */}
                {!isActive && !isDone && tasks.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {tasks.map(t => (
                      <span key={t.id} className="chip" style={{ fontSize: 12 }}>{t.title}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
