import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'bg-danger text-white font-ui font-medium px-6 py-3 rounded-full hover:opacity-90 transition-all duration-300 active:scale-95',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: '',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading = false,
  icon,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={cn(variants[variant], sizes[size], className)}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Đang xử lý...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {children}
        </span>
      )}
    </motion.button>
  )
}
