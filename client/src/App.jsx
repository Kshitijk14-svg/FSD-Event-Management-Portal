import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScaffoldHome from './pages/ScaffoldHome';
import './App.css';

/**
 * Root Application Component
 * Configured with React Router DOM for Phase F1 Scaffold.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScaffoldHome />} />
        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>404 - Not Found</h2>
              <p style={{ color: 'var(--text-muted)' }}>The requested route is not configured yet.</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
