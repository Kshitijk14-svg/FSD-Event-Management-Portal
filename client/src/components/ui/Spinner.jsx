import cn from '../../utils/cn.js';

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

/**
 * Simple loading spinner.
 *
 * @param {('sm'|'md'|'lg')} size
 */
export default function Spinner({ size = 'md', className, label = 'Loading…' }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center gap-2', className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-block animate-spin rounded-full border-gray-300 border-t-brand-600',
          sizes[size]
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
