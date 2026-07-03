import { cn } from '../../lib/utils'

const sizes = {
  sm:  'w-8 h-8 text-sm',
  md:  'w-10 h-10 text-base',
  lg:  'w-14 h-14 text-xl',
  xl:  'w-20 h-20 text-3xl',
}

export default function Avatar({ src, name, size = 'md', className, online }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div className={cn(
        'rounded-full overflow-hidden bg-primary flex items-center justify-center font-ui font-semibold text-white',
        sizes[size]
      )}>
        {src
          ? <img src={src} alt={name} className="w-full h-full object-cover" />
          : <span>{initials}</span>
        }
      </div>
      {online !== undefined && (
        <span className={cn(
          'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
          online ? 'bg-green-400' : 'bg-text-sub'
        )} />
      )}
    </div>
  )
}
