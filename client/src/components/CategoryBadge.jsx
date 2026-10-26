import React from 'react';
import './CategoryBadge.css';

const CATEGORY_ICONS = {
  technology: '💻',
  cultural: '🎭',
  workshop: '🛠️',
  sports: '🏆',
  academic: '📚',
};

/**
 * Reusable CategoryBadge Component
 * @param {string} category - Category string (e.g. Technology, Cultural, Workshop, Sports, Academic)
 * @param {boolean} showIcon - Whether to display category icon
 */
export default function CategoryBadge({ category = 'General', showIcon = true, className = '' }) {
  const normalized = (category || 'default').toLowerCase();
  const icon = CATEGORY_ICONS[normalized] || '📌';
  const badgeClass = `category-badge category-${normalized} ${className}`;

  return (
    <span className={badgeClass}>
      {showIcon && <span aria-hidden="true">{icon}</span>}
      <span>{category}</span>
    </span>
  );
}
