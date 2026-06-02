import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import { cn } from '../../lib/utils'

const MOOD_FILTERS = [
  { emoji: '😊', label: 'Vui vẻ',    value: 'happy' },
  { emoji: '😔', label: 'Buồn',       value: 'sad' },
  { emoji: '😌', label: 'Thư giãn',  value: 'calm' },
  { emoji: '💪', label: 'Năng lượng', value: 'energy' },
  { emoji: '😴', label: 'Ngủ ngon',  value: 'sleep' },
]

const MUSIC = [
  { title: 'Rainy Café Lofi',   artist: 'ChilledCow',     mood: 'calm',   color: 'bg-secondary/30' },
  { title: 'Morning Sunshine',  artist: 'Khai Dreams',    mood: 'happy',  color: 'bg-accent/60' },
  { title: 'Late Night Feels',  artist: 'Powfu',          mood: 'sad',    color: 'bg-secondary/40' },
  { title: 'High Energy Mix',   artist: 'Monstercat',     mood: 'energy', color: 'bg-warning/30' },
  { title: 'Deep Sleep Waves',  artist: 'Sleep Sounds',   mood: 'sleep',  color: 'bg-primary/20' },
  { title: 'Peaceful Garden',   artist: 'Nature Sounds',  mood: 'calm',   color: 'bg-accent/40' },
]

function BreathingExercise() {
  const [phase, setPhase] = useState('idle')
  const [count, setCount] = useState(0)

  const start = () => {
    setPhase('inhale')
    setCount(4)
    let c = 4
    const tick = setInterval(() => {
      c -= 1
      setCount(c)
      if (c === 0) clearInterval(tick)
    }, 1000)
  }

  const phaseLabel = {
    idle:   'Nhấn để bắt đầu',
    inhale: `Hít vào... ${count}`,
    hold:   `Giữ... ${count}`,
    exhale: `Thở ra... ${count}`,
  }

  return (
    <div className="card text-center py-12">
      <h3 className="font-display text-2xl text-text-main mb-2">Bài tập thở 4-7-8</h3>
      <p className="font-body text-text-sub text-sm mb-10">Giảm căng thẳng ngay lập tức</p>

      <div className="relative flex items-center justify-center mb-8">
        <div className={cn(
          'w-36 h-36 rounded-full flex items-center justify-center cursor-pointer transition-all duration-1000',
          phase === 'idle'
            ? 'bg-primary/30 hover:bg-primary/50'
            : 'bg-primary/50 animate-breathe'
        )}
          onClick={phase === 'idle' ? start : undefined}
        >
          <div className="w-24 h-24 rounded-full bg-primary/60 flex items-center justify-center">
            <p className="font-ui text-text-main text-sm font-medium text-center px-2">
              {phaseLabel[phase]}
            </p>
          </div>
        </div>
      </div>
      <p className="font-body text-text-sub text-sm">Kỹ thuật 4-7-8 giúp hệ thần kinh bình tĩnh lại</p>
    </div>
  )
}

export default function ExplorePage() {
  const [activeMood, setActiveMood] = useState('calm')
  const [activeTab, setActiveTab] = useState('music')
  const [playing, setPlaying] = useState(null)

  const filtered = MUSIC.filter(m => m.mood === activeMood)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-text-main mb-1">Khám phá</h1>
        <p className="font-body text-text-sub">Nhạc, thiền định và bài tập thở cho tâm trạng của bạn</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white rounded-2xl p-1.5 w-fit shadow-card">
        {[
          { key: 'music',    label: '🎵 Âm nhạc' },
          { key: 'breathing', label: '🌬️ Thở' },
          { key: 'podcast',  label: '🎙️ Podcast' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-5 py-2 rounded-xl font-ui text-sm font-medium transition-all duration-200',
              activeTab === tab.key
                ? 'bg-primary text-text-main shadow-card'
                : 'text-text-sub hover:text-text-main'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'music' && (
        <div>
          {/* Mood filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            {MOOD_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setActiveMood(f.value)}
                className={cn(
                  'mood-chip whitespace-nowrap',
                  activeMood === f.value
                    ? 'bg-primary text-text-main border-2 border-primary-dark'
                    : 'bg-white text-text-sub border-2 border-transparent hover:bg-primary/10'
                )}
              >
                {f.emoji} {f.label}
              </button>
            ))}
          </div>

          <motion.div layout className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(filtered.length ? filtered : MUSIC.slice(0, 3)).map((m, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn('card-hover', m.color)}
              >
                <div className="w-full aspect-square rounded-2xl bg-white/50 flex items-center justify-center text-5xl mb-4">
                  🎵
                </div>
                <h4 className="font-body font-semibold text-text-main mb-0.5">{m.title}</h4>
                <p className="font-ui text-xs text-text-sub mb-4">{m.artist}</p>
                <button
                  onClick={() => setPlaying(playing === i ? null : i)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full font-ui text-sm text-text-main hover:bg-white transition-colors"
                >
                  {playing === i ? <Pause size={14} /> : <Play size={14} />}
                  {playing === i ? 'Dừng' : 'Nghe ngay'}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {activeTab === 'breathing' && <BreathingExercise />}

      {activeTab === 'podcast' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: 'Tâm lý học dễ hiểu', ep: 'Tập 12: Kiểm soát lo âu', emoji: '🧠' },
            { title: 'Lo-fi Stories',       ep: 'Câu chuyện buổi tối',     emoji: '🌙' },
            { title: 'Thiền mỗi ngày',      ep: 'Thiền 10 phút buổi sáng', emoji: '🧘' },
            { title: 'Sống tích cực',       ep: 'Sắp xếp lại tâm trí',     emoji: '✨' },
          ].map((p, i) => (
            <div key={i} className="card-hover flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary/30 flex items-center justify-center text-3xl shrink-0">
                {p.emoji}
              </div>
              <div className="min-w-0">
                <p className="font-body font-semibold text-text-main text-sm">{p.title}</p>
                <p className="font-ui text-xs text-text-sub truncate">{p.ep}</p>
              </div>
              <Play size={18} className="text-text-sub ml-auto shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
