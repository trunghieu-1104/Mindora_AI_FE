export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date, locale = 'vi-VN') {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatTime(date, locale = 'vi-VN') {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const MOODS = [
  { emoji: '😊', label: 'Vui vẻ',    value: 'happy',   color: '#FFF0C8' },
  { emoji: '😐', label: 'Bình thường', value: 'neutral', color: '#E8DEFF' },
  { emoji: '😔', label: 'Buồn',       value: 'sad',     color: '#C8B8E8' },
  { emoji: '😰', label: 'Lo lắng',   value: 'anxious', color: '#FFB5A0' },
  { emoji: '😡', label: 'Tức giận',  value: 'angry',   color: '#FF8080' },
  { emoji: '🥰', label: 'Hạnh phúc', value: 'loved',   color: '#F9C6C9' },
]

export const QUICK_REPLIES = [
  { label: 'Tôi ổn 😊',      value: 'Tôi ổn, cảm ơn bạn đã hỏi!' },
  { label: 'Hơi buồn 😔',    value: 'Mình hơi buồn hôm nay...' },
  { label: 'Stress lắm 😰',  value: 'Mình đang rất stress, không biết phải làm gì.' },
  { label: 'Mệt mỏi 😴',     value: 'Mình cảm thấy mệt và kiệt sức.' },
  { label: 'Vui lắm 🥰',     value: 'Hôm nay mình vui lắm!' },
]
