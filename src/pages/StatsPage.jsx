import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Flame, CheckCircle2, ClipboardList, Sun, Moon, ChevronRight } from 'lucide-react';
import { calculateStats, db } from '../db';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    async function load() {
      const s = await calculateStats();
      setStats(s);
      const achs = await db.achievements.toArray();
      // Enrich with section names
      const sections = await db.sections.toArray();
      const enriched = achs.map(a => ({
        ...a,
        sectionName: sections.find(s => s.id === a.sectionId)?.name || 'Section',
      }));
      setAchievements(enriched);
    }
    load();
  }, []);

  if (!stats) return (
    <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <p style={{ color: 'var(--color-text-muted)' }}>Loading stats...</p>
    </div>
  );

  const xpProgress = ((stats.totalXP - stats.xpForCurrentLevel) / (stats.xpForNextLevel - stats.xpForCurrentLevel)) * 100;

  return (
    <div className="page-content">
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
        <span style={{ font: 'var(--text-headline-md)' }}>Level {stats.level}</span>
        <span style={{ font: 'var(--text-label-bold)', color: 'var(--color-primary)' }}>{stats.totalXP.toLocaleString()} XP</span>
      </div>

      <div style={{ padding: '0 var(--space-gutter)' }}>
        {/* Hero XP Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{
            textAlign: 'center', padding: '32px 24px', marginBottom: 16,
            background: 'linear-gradient(145deg, #f8fffe 0%, #edfcf2 100%)',
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--color-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <Star size={28} color="var(--color-gold-text)" fill="var(--color-gold-text)" />
          </div>
          <p style={{ font: 'var(--text-label-xs)', letterSpacing: '0.15em', color: 'var(--color-text-muted)', marginBottom: 8 }}>
            TOTAL LIFETIME XP
          </p>
          <p style={{ font: 'var(--text-display)', fontSize: 48, color: 'var(--color-primary)', marginBottom: 4 }}>
            {stats.totalXP.toLocaleString()} <span style={{ fontSize: 20 }}>XP</span>
          </p>
          <p style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
            Level {stats.level} {stats.levelTitle}
          </p>
          <div className="progress-bar" style={{ marginBottom: 8 }}>
            <div className="progress-bar__fill" style={{ width: `${Math.min(100, xpProgress)}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-muted)' }}>{stats.totalXP.toLocaleString()} XP</span>
            <span style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-muted)' }}>{stats.xpForNextLevel.toLocaleString()} XP to Lvl {stats.level + 1}</span>
          </div>
        </motion.div>

        {/* Streak Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #ffd700 0%, #ffeb3b 100%)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 16,
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Flame size={28} color="#FF6B00" fill="#FF8C00" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ font: 'var(--text-headline-md)', fontSize: 20, color: '#5C4800' }}>{stats.currentStreak} Day Streak</p>
            <p style={{ font: 'var(--text-label-sm)', color: '#7A6800' }}>You're on fire! Keep it up.</p>
          </div>
          <ChevronRight size={20} color="#7A6800" />
        </motion.div>

        {/* 2x2 Metric Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[
            { icon: CheckCircle2, value: stats.tasksCompleted.toLocaleString(), label: 'Tasks Completed', color: 'var(--color-primary)' },
            { icon: ClipboardList, value: stats.sectionsCompleted, label: 'Sections Completed', color: 'var(--color-text-secondary)' },
            { icon: Sun, value: `${Math.min(stats.currentStreak, 12)} Days`, label: 'Morning Streak', color: '#FF8C00' },
            { icon: Moon, value: `${Math.min(stats.currentStreak, 3)} Days`, label: 'Evening Streak', color: 'var(--color-text-secondary)' },
          ].map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="card"
              style={{ padding: '20px 16px' }}
            >
              <metric.icon size={24} color={metric.color} style={{ marginBottom: 12 }} />
              <p style={{ font: 'var(--text-headline-md)', marginBottom: 4 }}>{metric.value}</p>
              <p style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-muted)' }}>{metric.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <h3 style={{ font: 'var(--text-headline-md)', marginBottom: 16 }}>Achievements</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 24 }}>
          {achievements.length === 0 ? (
            <p style={{ font: 'var(--text-body-md)', color: 'var(--color-text-muted)', textAlign: 'center', padding: 32 }}>
              Complete routines to earn achievements!
            </p>
          ) : (
            achievements.map((ach, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="card"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--color-gold-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Star size={20} color="#B8960F" fill="#FFD700" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ font: 'var(--text-label-bold)' }}>2x Perfect Section</p>
                  <p style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-muted)' }}>
                    {ach.sectionName} Routine • {ach.date}
                  </p>
                </div>
                <span className="chip chip--selected" style={{ fontSize: 12 }}>+{ach.xpBonus || 100} XP</span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
