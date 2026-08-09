import cn from '../../utils/cn.js';

const tones = {
  gray: 'bg-gray-100 text-gray-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-800',
  blue: 'bg-blue-100 text-blue-700',
  indigo: 'bg-brand-100 text-brand-700',
};

/**
 * Small status/label pill.
 *
 * @param {('gray'|'green'|'red'|'yellow'|'blue'|'indigo')} tone
 */
export default function Badge({ tone = 'gray', className, children, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
