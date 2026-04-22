import React, { useState, useEffect } from 'react';
import { isOnboardingComplete } from './db';

// Pages
import WelcomeScreen from './pages/onboarding/WelcomeScreen';
import WakingWindowScreen from './pages/onboarding/WakingWindowScreen';
import DayDivisionScreen from './pages/onboarding/DayDivisionScreen';
import TutorialIntroScreen from './pages/onboarding/TutorialIntroScreen';
import TutorialFocusMode from './pages/onboarding/TutorialFocusMode';
import TutorialComplete from './pages/onboarding/TutorialComplete';
import TimelinePage from './pages/TimelinePage';
import BuilderPage from './pages/BuilderPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import FocusMode from './pages/FocusMode';
import SectionSummary from './pages/SectionSummary';

// Components
import BottomNav from './components/BottomNav';

const ROUTES = {
  // Onboarding
  WELCOME: 'welcome',
  WAKING_WINDOW: 'waking_window',
  DAY_DIVISION: 'day_division',
  TUTORIAL_INTRO: 'tutorial_intro',
  TUTORIAL_FOCUS: 'tutorial_focus',
  TUTORIAL_COMPLETE: 'tutorial_complete',
  // Main tabs
  TIMELINE: 'timeline',
  BUILDER: 'builder',
  STATS: 'stats',
  SETTINGS: 'settings',
  // Overlay
  FOCUS_MODE: 'focus_mode',
  SECTION_SUMMARY: 'section_summary',
  // Edit
  EDIT_WAKING_WINDOW: 'edit_waking_window',
  EDIT_DAY_DIVISION: 'edit_day_division',
};

function App() {
  const [route, setRoute] = useState(null);
  const [focusSectionId, setFocusSectionId] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const done = await isOnboardingComplete();
      setRoute(done ? ROUTES.TIMELINE : ROUTES.WELCOME);
      setLoading(false);
    }
    init();
  }, []);

  const navigate = (r) => setRoute(r);

  const startFocusMode = (sectionId) => {
    setFocusSectionId(sectionId);
    setRoute(ROUTES.FOCUS_MODE);
  };

  const showSummary = (data) => {
    setSummaryData(data);
    setRoute(ROUTES.SECTION_SUMMARY);
  };

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: 'var(--color-primary)', font: 'var(--text-headline-md)' }}>HabitFlow</div>
      </div>
    );
  }

  const isMainTab = [ROUTES.TIMELINE, ROUTES.BUILDER, ROUTES.STATS, ROUTES.SETTINGS].includes(route);

  return (
    <div className="app-container">
      {/* Onboarding */}
      {route === ROUTES.WELCOME && <WelcomeScreen onNext={() => navigate(ROUTES.WAKING_WINDOW)} />}
      {route === ROUTES.WAKING_WINDOW && <WakingWindowScreen onNext={() => navigate(ROUTES.DAY_DIVISION)} onBack={() => navigate(ROUTES.WELCOME)} onSkip={() => navigate(ROUTES.TIMELINE)} />}
      {route === ROUTES.DAY_DIVISION && <DayDivisionScreen onNext={() => navigate(ROUTES.TUTORIAL_INTRO)} onBack={() => navigate(ROUTES.WAKING_WINDOW)} onSkip={() => navigate(ROUTES.TIMELINE)} />}
      {route === ROUTES.TUTORIAL_INTRO && <TutorialIntroScreen onNext={() => navigate(ROUTES.TUTORIAL_FOCUS)} onBack={() => navigate(ROUTES.DAY_DIVISION)} onSkip={() => navigate(ROUTES.TIMELINE)} />}
      {route === ROUTES.TUTORIAL_FOCUS && <TutorialFocusMode onComplete={() => navigate(ROUTES.TUTORIAL_COMPLETE)} onClose={() => navigate(ROUTES.TIMELINE)} />}
      {route === ROUTES.TUTORIAL_COMPLETE && <TutorialComplete onNext={() => navigate(ROUTES.TIMELINE)} />}

      {/* Settings Edits */}
      {route === ROUTES.EDIT_WAKING_WINDOW && <WakingWindowScreen isEditing={true} onNext={() => navigate(ROUTES.SETTINGS)} onBack={() => navigate(ROUTES.SETTINGS)} onSkip={() => navigate(ROUTES.SETTINGS)} />}
      {route === ROUTES.EDIT_DAY_DIVISION && <DayDivisionScreen isEditing={true} onNext={() => navigate(ROUTES.SETTINGS)} onBack={() => navigate(ROUTES.SETTINGS)} onSkip={() => navigate(ROUTES.SETTINGS)} />}

      {/* Main Pages */}
      {route === ROUTES.TIMELINE && <TimelinePage onStartRoutine={startFocusMode} />}
      {route === ROUTES.BUILDER && <BuilderPage />}
      {route === ROUTES.STATS && <StatsPage />}
      {route === ROUTES.SETTINGS && <SettingsPage navigate={navigate} />}

      {/* Overlays */}
      {route === ROUTES.FOCUS_MODE && <FocusMode sectionId={focusSectionId} onComplete={showSummary} onClose={() => navigate(ROUTES.TIMELINE)} />}
      {route === ROUTES.SECTION_SUMMARY && <SectionSummary data={summaryData} onReturn={() => navigate(ROUTES.TIMELINE)} />}

      {/* Bottom Nav (only on main tabs) */}
      {isMainTab && <BottomNav activeTab={route} onTabChange={navigate} />}
    </div>
  );
}

export default App;
