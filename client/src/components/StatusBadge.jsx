import React from 'react';

export default function StatusBadge({ label, status = 'success' }) {
  const isSuccess = status === 'success';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.35rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: isSuccess
          ? 'rgba(16, 185, 129, 0.15)'
          : 'rgba(245, 158, 11, 0.15)',
        color: isSuccess ? 'var(--color-success)' : 'var(--color-warning)',
        border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: isSuccess
            ? 'var(--color-success)'
            : 'var(--color-warning)',
          boxShadow: isSuccess
            ? '0 0 8px var(--color-success)'
            : '0 0 8px var(--color-warning)',
        }}
      />
      {label}
    </span>
  );
}
