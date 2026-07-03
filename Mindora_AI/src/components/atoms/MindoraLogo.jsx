import heroPng from '../../assets/hero.png'

export default function MindoraLogo({ size = 100 }) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315]

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ml-petal-pink" cx="50%" cy="22%" r="78%">
          <stop offset="0%" stopColor="#eff6ff" />
          <stop offset="100%" stopColor="#2563eb" />
        </radialGradient>

        <radialGradient id="ml-petal-violet" cx="50%" cy="22%" r="78%">
          <stop offset="0%" stopColor="#fefce8" />
          <stop offset="100%" stopColor="#eab308" />
        </radialGradient>

        <filter id="ml-petal-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#60a5fa" floodOpacity="0.4" />
        </filter>

        <filter id="ml-img-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#1e3a8a" floodOpacity="0.35" />
        </filter>

        <clipPath id="ml-circle-clip">
          <circle cx="50" cy="50" r="27" />
        </clipPath>
      </defs>

      {/* Petals */}
      <g filter="url(#ml-petal-glow)">
        {petals.map((angle, i) => (
          <g key={angle} transform={`rotate(${angle}, 50, 50)`}>
            <ellipse
              cx="50" cy="22"
              rx="11" ry="19"
              fill={i % 2 === 0 ? 'url(#ml-petal-pink)' : 'url(#ml-petal-violet)'}
              stroke={i % 2 === 0 ? '#93c5fd' : '#fde047'}
              strokeWidth="0.6"
              opacity="0.93"
            />
          </g>
        ))}
      </g>

      {/* Accent dots between petals */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const r = 40
        const cx = 50 + r * Math.sin(rad)
        const cy = 50 - r * Math.cos(rad)
        return (
          <circle key={i} cx={cx} cy={cy} r="2"
            fill={i % 2 === 0 ? '#60a5fa' : '#facc15'}
            opacity="0.85"
          />
        )
      })}

      {/* hero.png clipped to circle */}
      <image
        href={heroPng}
        x="23" y="23"
        width="54" height="54"
        clipPath="url(#ml-circle-clip)"
        filter="url(#ml-img-shadow)"
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Rim around image */}
      <circle cx="50" cy="50" r="27" fill="none"
        stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
    </svg>
  )
}
