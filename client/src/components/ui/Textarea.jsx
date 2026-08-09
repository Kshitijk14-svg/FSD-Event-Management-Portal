import cn from '../../utils/cn.js';

/**
 * Accessible textarea with a label.
 */
export default function Textarea({
  label,
  id,
  error,
  className,
  rows = 4,
  ...rest
}) {
  const textareaId =
    id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900',
          'placeholder:text-gray-400 resize-y',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
          error ? 'border-red-400' : 'border-gray-300',
          className
        )}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
