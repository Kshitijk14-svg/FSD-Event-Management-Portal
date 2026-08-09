import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import cn from '../../utils/cn.js';

/**
 * Accessible modal dialog.
 *
 * - Closes on Escape, on backdrop click, or via the X button.
 * - Focus is moved into the dialog and restored on close.
 * - `open` fully controls visibility; `onClose` is required.
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  className,
  size = 'md',
}) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
  };

  // Manage escape-to-close and focus management.
  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    dialogRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          'relative w-full rounded-lg bg-white shadow-xl outline-none',
          sizes[size],
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 id="modal-title" className="text-base font-semibold text-gray-900">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
