import React from 'react';
import './Pagination.css';

/**
 * Reusable Pagination Component
 * @param {number} page - Active page number (1-indexed)
 * @param {number} pages - Total number of pages
 * @param {number} total - Total count of items
 * @param {Function} onPageChange - Callback receiving new page number
 */
export default function Pagination({
  page = 1,
  pages = 1,
  total = 0,
  onPageChange,
}) {
  // If there is only 1 page or less, do not display pagination controls
  if (pages <= 1) {
    return null;
  }

  const currentPage = Math.max(1, Math.min(page, pages));

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="pagination-wrapper" aria-label="Event catalog pagination">
      <div className="pagination-summary">
        Showing page <strong>{currentPage}</strong> of <strong>{pages}</strong>
        {total > 0 && <span> ({total} total events)</span>}
      </div>

      <ul className="pagination-controls">
        {/* Previous Button */}
        <li>
          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Go to previous page"
          >
            ‹ Prev
          </button>
        </li>

        {/* Page Buttons with Ellipses */}
        {pageNumbers.map((p, idx) => (
          <li key={`${p}-${idx}`}>
            {p === '...' ? (
              <span className="pagination-ellipsis">…</span>
            ) : (
              <button
                type="button"
                className={`pagination-btn ${p === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(p)}
                aria-label={`Go to page ${p}`}
                aria-current={p === currentPage ? 'page' : undefined}
              >
                {p}
              </button>
            )}
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage >= pages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Go to next page"
          >
            Next ›
          </button>
        </li>
      </ul>
    </nav>
  );
}
