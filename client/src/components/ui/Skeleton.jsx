import cn from '../../utils/cn.js';

/**
 * Barbell-less loading placeholder that pulses while content loads.
 */
export default function Skeleton({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
    />
  );
}

/**
 * A ready-made card-shaped skeleton for list/grid loading states.
 */
export function CardSkeleton({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-5 shadow-card',
        className
      )}
    >
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-2/3" />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}
