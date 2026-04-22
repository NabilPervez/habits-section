import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Plus, X } from 'lucide-react';
import { getSections, getTasksForSection, db } from '../db';
import { TASK_ICONS } from '../data/seedData';
import Icon from '../components/Icon';

export default function BuilderPage() {
  const [sections, setSections] = useState([]);
  const [tasksBySection, setTasksBySection] = useState({});
  const [showSheet, setShowSheet] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null);

  // New habit form state
  const [habitName, setHabitName] = useState('');
  const [habitIcon, setHabitIcon] = useState('dumbbell');
  const [habitPriority, setHabitPriority] = useState('mandatory');
  const [habitDuration, setHabitDuration] = useState(15);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const s = await getSections();
    setSections(s);
    const tbys = {};
    for (const sec of s) {
      tbys[sec.id] = await getTasksForSection(sec.id);
    }
    setTasksBySection(tbys);
    if (!activeSectionId && s.length > 0) setActiveSectionId(s[0].id);
  }

  const openNewHabit = (sectionId) => {
    setActiveSectionId(sectionId);
    setHabitName('');
    setHabitIcon('dumbbell');
    setHabitPriority('mandatory');
    setHabitDuration(15);
    setEditTask(null);
    setShowSheet(true);
  };

  const saveHabit = async () => {
    if (!habitName.trim()) return;
    const tasksInSection = tasksBySection[activeSectionId] || [];

    if (editTask) {
      await db.tasks.update(editTask.id, {
        title: habitName,
        icon: habitIcon,
        isMandatory: habitPriority === 'mandatory',
        durationMinutes: habitDuration,
      });
    } else {
      await db.tasks.add({
        sectionId: activeSectionId,
        title: habitName,
        icon: habitIcon,
        isMandatory: habitPriority === 'mandatory',
        durationMinutes: habitDuration,
        order: tasksInSection.length,
      });
    }

    setShowSheet(false);
    loadData();
  };

  const deleteTask = async (taskId) => {
    await db.tasks.delete(taskId);
    loadData();
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ padding: 'var(--space-lg) var(--space-gutter) var(--space-sm)' }}>
        <h1 style={{ font: 'var(--text-display)', marginBottom: 8 }}>Routine Builder</h1>
        <p style={{ font: 'var(--text-body-md)', color: 'var(--color-text-secondary)' }}>
          Design your ideal day, block by block.
        </p>
      </div>

      {/* Section groups */}
      <div style={{ padding: '0 var(--space-gutter)' }}>
        {sections.map((section, sIdx) => {
          const tasks = tasksBySection[section.id] || [];
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sIdx * 0.1 }}
              style={{ marginBottom: 32 }}
            >
              {/* Section label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Icon name={section.icon} size={20} color="var(--color-text-secondary)" />
                <h2 style={{ font: 'var(--text-headline-md)', fontSize: 20 }}>{section.name}</h2>
              </div>

              {/* Task cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ scale: 1.01 }}
                    className="card"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px', cursor: 'pointer',
                    }}
                    onClick={() => {
                      setEditTask(task);
                      setActiveSectionId(section.id);
                      setHabitName(task.title);
                      setHabitIcon(task.icon);
                      setHabitPriority(task.isMandatory ? 'mandatory' : 'optional');
                      setHabitDuration(task.durationMinutes);
                      setShowSheet(true);
                    }}
                  >
                    <GripVertical size={18} color="var(--color-text-muted)" style={{ flexShrink: 0, cursor: 'grab' }} />
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'var(--color-primary-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon name={task.icon} size={18} color="var(--color-primary)" />
                    </div>
                    <span style={{ font: 'var(--text-body-md)', fontWeight: 500, flex: 1 }}>{task.title}</span>
                    {task.durationMinutes > 0 && (
                      <span className="chip" style={{ fontSize: 11 }}>{task.durationMinutes}m</span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Add button for section */}
              <button
                onClick={() => openNewHabit(section.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 16px', marginTop: 8,
                  color: 'var(--color-text-muted)',
                  font: 'var(--text-body-md)',
                  width: '100%',
                  borderRadius: 12,
                  border: '1px dashed var(--color-border)',
                }}
              >
                <Plus size={18} /> Add a habit...
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Floating add button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => openNewHabit(sections[0]?.id)}
        style={{
          position: 'fixed', bottom: 90, right: 'calc(50% - 220px)',
          width: 56, height: 56, borderRadius: 16,
          background: 'var(--color-primary)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-elevated)',
          zIndex: 50,
        }}
        id="btn-add-habit-fab"
      >
        <Plus size={28} />
      </motion.button>

      {/* Bottom Sheet: New Habit */}
      <AnimatePresence>
        {showSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bottom-sheet-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) setShowSheet(false); }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bottom-sheet"
            >
              <div className="bottom-sheet__handle" />

              {/* Title */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ font: 'var(--text-headline-md)' }}>{editTask ? 'Edit Habit' : 'New Habit'}</h2>
                <button onClick={() => setShowSheet(false)}>
                  <X size={24} color="var(--color-text-muted)" />
                </button>
              </div>

              {/* Habit Name */}
              <label style={{ font: 'var(--text-label-xs)', letterSpacing: '0.1em', color: 'var(--color-text-muted)', display: 'block', marginBottom: 8 }}>
                HABIT NAME
              </label>
              <input
                type="text"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder="What do you want to build?"
                style={{
                  width: '100%', padding: '14px 16px',
                  border: '2px solid var(--color-border)', borderRadius: 12,
                  font: 'var(--text-body-md)', marginBottom: 20,
                }}
                id="input-habit-name"
              />

              {/* Icon Picker */}
              <label style={{ font: 'var(--text-label-xs)', letterSpacing: '0.1em', color: 'var(--color-text-muted)', display: 'block', marginBottom: 8 }}>
                ICON
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {TASK_ICONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setHabitIcon(icon)}
                    style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: habitIcon === icon ? 'var(--color-primary)' : 'var(--color-surface)',
                      border: habitIcon === icon ? 'none' : '1px solid var(--color-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Icon name={icon} size={20} color={habitIcon === icon ? 'white' : 'var(--color-text-secondary)'} />
                  </button>
                ))}
              </div>

              {/* Priority */}
              <label style={{ font: 'var(--text-label-xs)', letterSpacing: '0.1em', color: 'var(--color-text-muted)', display: 'block', marginBottom: 8 }}>
                PRIORITY
              </label>
              <div style={{ display: 'flex', gap: 0, marginBottom: 20 }}>
                {['mandatory', 'optional'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setHabitPriority(p)}
                    style={{
                      flex: 1, padding: '12px',
                      background: habitPriority === p ? 'var(--color-text-primary)' : 'var(--color-surface)',
                      color: habitPriority === p ? 'white' : 'var(--color-text-secondary)',
                      font: 'var(--text-label-bold)',
                      borderRadius: p === 'mandatory' ? '12px 0 0 12px' : '0 12px 12px 0',
                      border: habitPriority === p ? 'none' : '1px solid var(--color-border)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Duration */}
              <label style={{ font: 'var(--text-label-xs)', letterSpacing: '0.1em', color: 'var(--color-text-muted)', display: 'block', marginBottom: 8 }}>
                ESTIMATED TIME
              </label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {[5, 15, 30, 60].map((d) => (
                  <button
                    key={d}
                    onClick={() => setHabitDuration(d)}
                    className={`chip ${habitDuration === d ? 'chip--selected' : ''}`}
                    style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                  >
                    {d >= 60 ? `${d / 60}h+` : `${d}m`}
                  </button>
                ))}
              </div>

              {/* Save + Delete */}
              <motion.button whileTap={{ scale: 0.95 }} className="btn-primary" onClick={saveHabit} id="btn-save-habit">
                {editTask ? 'Update Habit' : 'Save Habit'}
              </motion.button>

              {editTask && (
                <button
                  onClick={() => { deleteTask(editTask.id); setShowSheet(false); }}
                  className="btn-ghost"
                  style={{ width: '100%', marginTop: 12, color: 'var(--color-danger)' }}
                >
                  Delete Habit
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
