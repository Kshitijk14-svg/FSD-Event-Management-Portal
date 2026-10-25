import React, { useState } from 'react';
import apiClient from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function ScaffoldHome() {
  const [testResult, setTestResult] = useState(null);

  const testAxiosConfig = () => {
    // Read baseURL and headers configured in apiClient
    const baseURL = apiClient.defaults.baseURL || '(not defined in .env - fallback active)';
    const token = localStorage.getItem('token');
    setTestResult({
      configuredBaseURL: baseURL,
      activeToken: token ? `${token.substring(0, 10)}...` : 'None in localStorage',
      status: 'Axios instance initialized and ready',
    });
  };

  const setSampleToken = () => {
    localStorage.setItem('token', 'sample-jwt-token-xyz123');
    testAxiosConfig();
  };

  const clearSampleToken = () => {
    localStorage.removeItem('token');
    testAxiosConfig();
  };

  const checklistItems = [
    { title: 'React 18 & Vite', desc: 'Running on development server port 5173', done: true },
    { title: 'Axios Client Instance', desc: 'Configured in src/api/client.js reading VITE_API_URL', done: true },
    { title: 'Request Interceptor', desc: 'Attaches Authorization: Bearer <token> from localStorage', done: true },
    { title: 'Safe 401 Interceptor', desc: 'Clears invalid credentials without infinite reload loops', done: true },
    { title: 'Folder Structure', desc: 'api/, components/, pages/, context/, styles/, utils/', done: true },
    { title: 'Environment Config', desc: 'client/.env.example prepared for local development', done: true },
  ];

  return (
    <div className="scaffold-container">
      {/* Header Banner */}
      <header className="scaffold-header">
        <div className="badge-wrapper">
          <StatusBadge label="Phase F1: Scaffold Complete" status="success" />
          <span className="version-pill">React 18 + Vite</span>
        </div>
        <h1 className="hero-title">
          MERN Event Management Portal
        </h1>
        <p className="hero-subtitle">
          Frontend client scaffold initialized. Ready for Phase F2 (Routing & Layout).
        </p>
      </header>

      {/* Grid of Verification Cards */}
      <section className="cards-grid">
        {/* Checklist Card */}
        <div className="glass-card">
          <h2 className="card-title">Architecture Checklist</h2>
          <ul className="checklist">
            {checklistItems.map((item, idx) => (
              <li key={idx} className="checklist-item">
                <span className="check-icon">✓</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Axios Client Verification */}
        <div className="glass-card">
          <h2 className="card-title">Axios Client Verification</h2>
          <p className="card-desc">
            Verify that the Axios client instance reads environment settings and manages JWT headers cleanly.
          </p>

          <div className="button-group">
            <button className="btn btn-primary" onClick={testAxiosConfig}>
              Inspect Axios Client
            </button>
            <button className="btn btn-secondary" onClick={setSampleToken}>
              Set Mock Token
            </button>
            <button className="btn btn-outline" onClick={clearSampleToken}>
              Clear Mock Token
            </button>
          </div>

          {testResult && (
            <div className="result-box">
              <div className="result-row">
                <span className="result-label">Base URL:</span>
                <code>{testResult.configuredBaseURL}</code>
              </div>
              <div className="result-row">
                <span className="result-label">Stored Token:</span>
                <code>{testResult.activeToken}</code>
              </div>
              <div className="result-row">
                <span className="result-label">Client Status:</span>
                <span className="result-status">{testResult.status}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Directory Map Card */}
      <section className="glass-card structure-card">
        <h2 className="card-title">Module Structure (client/src/)</h2>
        <div className="structure-grid">
          <div className="dir-item">
            <code>api/</code>
            <span>Reusable Axios client & API endpoints</span>
          </div>
          <div className="dir-item">
            <code>components/</code>
            <span>Shared UI components (Navbar, Footer, Modals)</span>
          </div>
          <div className="dir-item">
            <code>pages/</code>
            <span>Routed view components</span>
          </div>
          <div className="dir-item">
            <code>context/</code>
            <span>Global state & AuthContext</span>
          </div>
          <div className="dir-item">
            <code>styles/</code>
            <span>Design tokens & global typography</span>
          </div>
          <div className="dir-item">
            <code>utils/</code>
            <span>Helper utilities, constants & storage keys</span>
          </div>
        </div>
      </section>
    </div>
  );
}
