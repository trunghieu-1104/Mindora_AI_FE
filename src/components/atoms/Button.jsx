import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'bg-danger text-white font-ui font-medium px-6 py-3 rounded-full hover:opacity-90 transition-all duration-300 active:scale-95',
  gradient: 'bg-gradient-to-r from-primary to-primary-dark text-white font-ui font-semibold px-6 py-3.5 rounded-2xl shadow-card hover:shadow-soft transition-all duration-300 active:scale-95',
  outline: 'bg-transparent border border-primary/20 text-text-sub font-ui font-medium px-6 py-3 rounded-2xl hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 active:scale-95',
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
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.96 }}
      className={cn('inline-flex items-center justify-center gap-2', variants[variant], sizes[size], className)}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Đang xử lý...
        </>
      ) : (
        <>
          {icon && <span className="inline-flex">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  )
}
