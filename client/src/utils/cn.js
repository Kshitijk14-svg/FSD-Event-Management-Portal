import { clsx } from 'clsx';

/**
 * Tiny className combiner built on clsx.
 * Usage: cn('px-4', isActive && 'bg-white', className)
 */
export default function cn(...inputs) {
  return clsx(inputs);
}
