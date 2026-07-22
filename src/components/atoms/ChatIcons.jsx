// Bộ icon vẽ tay thuần SVG cho khung chat — không phụ thuộc thư viện ngoài,
// nét bo tròn mềm mại để khớp tinh thần "chữa lành" của Dora.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconSend({ size = 18, className = '', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base} strokeWidth={strokeWidth}>
      <path d="M3.4 11.6 20.5 3.3c.6-.3 1.2.3.9.9l-6.6 15.9c-.3.7-1.3.7-1.5-.1l-1.9-6.3-6.3-1.9c-.8-.2-.8-1.2.3-1.2Z" strokeLinejoin="round" />
      <path d="M11.4 13.6 20.5 3.3" />
    </svg>
  )
}

export function IconMusicNote({ size = 14, className = '', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base} strokeWidth={strokeWidth}>
      <path d="M9 17.5V5.2c0-.5.4-1 .9-1.1l9-1.6c.6-.1 1.1.4 1.1 1v11" />
      <ellipse cx="6.3" cy="17.7" rx="2.8" ry="2.1" />
      <ellipse cx="17.5" cy="15.6" rx="2.8" ry="2.1" />
    </svg>
  )
}

export function IconJournal({ size = 14, className = '', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base} strokeWidth={strokeWidth}>
      <path d="M12 6.2c-1.7-1.4-4.4-1.9-7.3-1.4-.4.1-.7.5-.7.9v12.6c0 .6.6 1 1.1.9 2.6-.5 5 0 6.6 1.3" />
      <path d="M12 6.2c1.7-1.4 4.4-1.9 7.3-1.4.4.1.7.5.7.9v12.6c0 .6-.6 1-1.1.9-2.6-.5-5 0-6.6 1.3" />
      <path d="M12 6.2v14.3" />
    </svg>
  )
}

export function IconTrash({ size = 18, className = '', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base} strokeWidth={strokeWidth}>
      <path d="M4.5 6.8h15" />
      <path d="M9.3 6.8V5.1c0-.6.5-1.1 1.1-1.1h3.2c.6 0 1.1.5 1.1 1.1v1.7" />
      <path d="M6.7 6.8l.9 12.4c.1.9.8 1.6 1.7 1.6h5.4c.9 0 1.6-.7 1.7-1.6l.9-12.4" />
      <path d="M10.3 10.4v6.6" />
      <path d="M13.7 10.4v6.6" />
    </svg>
  )
}

export function IconSmile({ size = 18, className = '', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M8.6 10.4c.3-.8.9-.8 1.2 0" />
      <path d="M14.2 10.4c.3-.8.9-.8 1.2 0" />
      <path d="M8.3 13.6c1.4 2.1 6 2.1 7.4 0" />
    </svg>
  )
}

export function IconExternalLink({ size = 12, className = '', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base} strokeWidth={strokeWidth}>
      <path d="M10.5 5.5H6.8c-.9 0-1.6.7-1.6 1.6v9.6c0 .9.7 1.6 1.6 1.6h9.6c.9 0 1.6-.7 1.6-1.6v-3.7" />
      <path d="M13.7 4.2h6.1v6.1" />
      <path d="M19.6 4.4l-8.8 8.8" />
    </svg>
  )
}

export function IconPlus({ size = 14, className = '', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base} strokeWidth={strokeWidth}>
      <path d="M12 5.2v13.6" />
      <path d="M5.2 12h13.6" />
    </svg>
  )
}

export function IconChatBubble({ size = 16, className = '', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base} strokeWidth={strokeWidth}>
      <path d="M4.4 6.6c0-1.2 1-2.2 2.2-2.2h10.8c1.2 0 2.2 1 2.2 2.2v7.4c0 1.2-1 2.2-2.2 2.2H9.6l-3.9 3.3c-.4.3-1 0-1-.5v-2.8h-.1c-1.2 0-2.2-1-2.2-2.2Z" />
      <path d="M8.2 8.7h7.8" />
      <path d="M8.2 11.9h5.2" />
    </svg>
  )
}

export function IconSparkle({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.5c.4 3.1 1.1 5.2 2.2 6.3 1.1 1.1 3.2 1.8 6.3 2.2-3.1.4-5.2 1.1-6.3 2.2-1.1 1.1-1.8 3.2-2.2 6.3-.4-3.1-1.1-5.2-2.2-6.3-1.1-1.1-3.2-1.8-6.3-2.2 3.1-.4 5.2-1.1 6.3-2.2 1.1-1.1 1.8-3.2 2.2-6.3Z" />
    </svg>
  )
}

export function IconLeaf({ size = 16, className = '', strokeWidth = 1.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base} strokeWidth={strokeWidth}>
      <path d="M19.3 4.7c.5 6-1 10.4-4.4 13.8-3.4 3.4-7.8 4.9-13.8 4.4C.6 16.9 2.1 12.5 5.5 9.1 8.9 5.7 13.3 4.2 19.3 4.7Z" />
      <path d="M18.5 5.5C14 10 9.8 14 6 18" />
    </svg>
  )
}
