import React from 'react';
import { Clock, ClipboardList, BarChart3, Settings } from 'lucide-react';

const tabs = [
  { key: 'timeline', label: 'Timeline', Icon: Clock },
  { key: 'builder', label: 'Builder', Icon: ClipboardList },
  { key: 'stats', label: 'Stats', Icon: BarChart3 },
  { key: 'settings', label: 'Settings', Icon: Settings },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav">
      {tabs.map(({ key, label, Icon }) => (
        <button
          key={key}
          className={`bottom-nav__item ${activeTab === key ? 'bottom-nav__item--active' : ''}`}
          onClick={() => onTabChange(key)}
          id={`nav-${key}`}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
