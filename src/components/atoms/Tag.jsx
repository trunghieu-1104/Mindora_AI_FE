import { cn } from '../../lib/utils'

export default function Tag({ children, className, onClick }) {
  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-ui text-secondary-dark bg-secondary/20',
        onClick && 'cursor-pointer hover:bg-secondary/40 transition-colors duration-200',
        className
      )}
    >
      #{children}
    </span>
  )
}
