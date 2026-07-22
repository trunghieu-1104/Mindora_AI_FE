import { cn } from '../../lib/utils'

const variants = {
  primary:   'bg-primary/30 text-text-main',
  secondary: 'bg-secondary/30 text-text-main',
  accent:    'bg-accent text-text-main',
  warning:   'bg-warning/30 text-text-main',
  danger:    'bg-danger/20 text-danger',
  success:   'bg-green-100 text-green-700',
}

export default function Badge({ children, variant = 'primary', className }) {
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-ui font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
