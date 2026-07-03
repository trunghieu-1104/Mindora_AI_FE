import { motion } from 'framer-motion'
import { MOODS, cn } from '../../lib/utils'

export default function CircularMoodPicker({ value, onChange }) {
  // Radius of the circle in percentage (approx 36% to fit w-14 buttons comfortably)
  const radius = 35

  // Map MOODS to angles. 6 moods = 60 degrees apart, starting from top (-90 degrees)
  const moodsWithPositions = MOODS.map((m, index) => {
    const angleDeg = -90 + index * 60
    const angleRad = (angleDeg * Math.PI) / 180
    const x = radius * Math.cos(angleRad)
    const y = radius * Math.sin(angleRad)
    return { ...m, x, y, angleDeg }
  })

  // Find currently selected mood object
  const selectedMood = MOODS.find((m) => m.value === value)

  // Find index of selected mood to rotate the decorative star
  const selectedIndex = MOODS.findIndex((m) => m.value === value)
  const starAngle = selectedIndex >= 0 ? -90 + selectedIndex * 60 + 30 : -90 + 30 // offset by 30 deg to sit between items

  return (
    <div className="relative w-80 h-80 mx-auto flex items-center justify-center select-none">
      {/* SVG Connecting Track Ring */}
      <svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 200 200">
        {/* Main Circle Path */}
        <circle
          cx="100"
          cy="100"
          r="70" // 70 out of 200 matches 35% of 200px
          fill="none"
          stroke="url(#track-gradient)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          className="opacity-70"
        />

        {/* Decorative elements */}
        {/* Small golden circle dot */}
        <circle cx="100" cy="30" r="3" fill="#EAB308" className="opacity-80" />

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="track-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#EAB308" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {/* Rotating Star Indicator (mimics the star in Mood_Picker.jpg) */}
      <motion.div
        className="absolute pointer-events-none text-xl"
        animate={{
          x: 70 * Math.cos((starAngle * Math.PI) / 180),
          y: 70 * Math.sin((starAngle * Math.PI) / 180),
          rotate: starAngle + 90,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        style={{
          left: 'calc(50% - 10px)',
          top: 'calc(50% - 10px)',
        }}
      >
        
      </motion.div>

      {/* Central selected mood label */}
      <div className="absolute w-28 h-28 rounded-full bg-white/60 backdrop-blur-sm shadow-soft border border-primary/10 flex flex-col items-center justify-center text-center p-2 z-0">
        <span className="font-ui text-xs text-text-sub uppercase tracking-wider mb-0.5">Tâm trạng</span>
        {selectedMood ? (
          <>
            <span className="text-3xl mb-1">{selectedMood.emoji}</span>
            <span className="font-display font-semibold text-sm text-text-main leading-tight">
              {selectedMood.label}
            </span>
          </>
        ) : (
          <>
            <span className="text-3xl text-text-sub/30 mb-1">❓</span>
            <span className="font-ui text-xs text-text-sub">Chưa chọn</span>
          </>
        )}
      </div>

      {/* Mood Buttons positioned absolutely around the circle */}
      {moodsWithPositions.map((m) => {
        const isSelected = value === m.value
        return (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            className="absolute z-10 w-14 h-14 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-300 cursor-pointer shadow-soft outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
            style={{
              left: `calc(50% + ${m.x}% - 28px)`,
              top: `calc(50% + ${m.y}% - 28px)`,
              backgroundColor: m.color || '#white',
              borderColor: isSelected ? 'var(--color-primary)' : 'transparent',
              transform: isSelected ? 'scale(1.15)' : 'scale(1)',
              boxShadow: isSelected
                ? '0 10px 25px -5px rgba(37, 99, 235, 0.4), inset 0 -4px 6px rgba(0, 0, 0, 0.05)'
                : '0 4px 12px rgba(22, 35, 61, 0.08), inset 0 -3px 4px rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* 3D Glassy reflection sheen */}
            <div className="absolute top-0.5 left-1 w-12 h-5 rounded-t-full bg-white/30 pointer-events-none" />

            <span className="text-2xl filter drop-shadow-sm transition-transform active:scale-90 select-none">
              {m.emoji}
            </span>

            {/* Micro label underneath emoji inside the button */}
            <span
              className={cn(
                'absolute -bottom-5 left-1/2 -translate-x-1/2 font-ui text-[10px] whitespace-nowrap transition-opacity duration-200 pointer-events-none',
                isSelected ? 'opacity-100 font-bold text-primary' : 'opacity-0'
              )}
            >
              {m.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
