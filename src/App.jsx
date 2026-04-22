import React from 'react';

function App() {
  return (
    <div className="app-container">
      <header style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Habit Tracker</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Sectional routine builder</p>
      </header>
      
      <main style={{ padding: '24px' }}>
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Ready to start your routine?</h2>
          <button style={{ 
            backgroundColor: 'var(--primary-success)', 
            color: 'white', 
            padding: '16px 32px', 
            borderRadius: '100px',
            fontSize: '16px',
            fontWeight: '700',
            width: '100%',
            transition: 'transform 0.2s, background-color 0.2s'
          }}>
            Start Routine
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
