import cn from '../../utils/cn.js';

/**
 * Simple contained card with optional header/body/footer.
 * Use props or the slot-based API depending on your needs.
 */
export default function Card({ className, children, as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={cn(
        'rounded-lg border border-gray-200 bg-white shadow-card',
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ className, title, subtitle, action, ...rest }) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4',
        className
      )}
      {...rest}
    >
      <div>
        {title && (
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        )}
        {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, children, ...rest }) {
  return (
    <div className={cn('px-5 py-4', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-3',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
