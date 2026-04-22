import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Flame, CheckCircle2, ClipboardList, Sun, Moon, ChevronRight, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateStats, db } from '../db';
import { ALL_ACHIEVEMENTS } from '../data/seedData';
import Icon from '../components/Icon';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function load() {
      const s = await calculateStats();
      setStats(s);

      // Map earned achievements
      const earned = await db.achievements.toArray();
      const sections = await db.sections.toArray();
      
      const mixedAchievements = ALL_ACHIEVEMENTS.map(ach => {
        // Did we earn this?
        const found = earned.find(e => e.type === ach.id);
        if (found) {
          const sectionName = sections.find(sec => sec.id === found.sectionId)?.name;
          return {
            ...ach,
            unlocked: true,
            date: found.date,
            subtitle: sectionName ? `${sectionName} • ${found.date}` : found.date
          };
        }
        return { ...ach, unlocked: false, subtitle: 'Locked' };
      });
      
      // Sort: Unlocked first, then by XP bonus
      mixedAchievements.sort((a, b) => {
        if (a.unlocked && !b.unlocked) return -1;
        if (!a.unlocked && b.unlocked) return 1;
        return a.xpBonus - b.xpBonus;
      });

      setAchievements(mixedAchievements);

      // Build chart data (last 7 days XP)
      const history = await db.history.toArray();
      const last7Days = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        const dayTasks = history.filter(h => h.date === dateStr && !h.skipped);
        const dayXP = dayTasks.reduce((sum, h) => sum + (h.xpEarned || 0), 0);
        
        // Simple day name (Sun, Mon, etc)
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        last7Days.push({
          name: dayName,
          xp: dayXP
        });
      }
      setChartData(last7Days);
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
            marginBottom: 24,
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

        {/* Weekly Chart */}
        <h3 style={{ font: 'var(--text-headline-md)', marginBottom: 16 }}>Weekly Momentum</h3>
        <div className="card" style={{ padding: '24px 16px 16px', marginBottom: 24, height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} dy={10} />
              <Tooltip cursor={{ fill: 'var(--color-surface)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-card)' }} />
              <Bar dataKey="xp" fill="var(--color-primary)" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

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

        {/* Achievements List */}
        <h3 style={{ font: 'var(--text-headline-md)', marginBottom: 16 }}>Achievements</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 24 }}>
          {achievements.map((ach, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="card"
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                opacity: ach.unlocked ? 1 : 0.6,
                background: ach.unlocked ? 'var(--color-surface-elevated)' : 'var(--color-surface)',
                border: ach.unlocked ? '1px solid var(--color-border)' : '1px dashed var(--color-border)'
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: ach.unlocked ? 'var(--color-gold-bg)' : 'transparent',
                border: ach.unlocked ? 'none' : '2px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {ach.unlocked ? (
                  <Icon name={ach.icon} size={20} color="#B8960F" style={{ fill: '#FFD700' }} />
                ) : (
                  <Lock size={18} color="var(--color-text-muted)" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ font: 'var(--text-label-bold)', color: ach.unlocked ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  {ach.title}
                </p>
                <p style={{ font: 'var(--text-label-sm)', color: 'var(--color-text-muted)' }}>
                  {ach.unlocked ? ach.subtitle : ach.description}
                </p>
              </div>
              <span className={`chip ${ach.unlocked ? 'chip--selected' : ''}`} style={{ fontSize: 12 }}>
                +{ach.xpBonus} XP
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
