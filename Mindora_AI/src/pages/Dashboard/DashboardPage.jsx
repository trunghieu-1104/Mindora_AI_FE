import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import Badge from '../../components/atoms/Badge'
import Button from '../../components/atoms/Button'
import { useAppStore } from '../../store/useAppStore'
import { MOODS, cn } from '../../lib/utils'

const MOCK_MOOD_DATA = [
  { day: 'T2', score: 6 },
  { day: 'T3', score: 4 },
  { day: 'T4', score: 5 },
  { day: 'T5', score: 3 },
  { day: 'T6', score: 4 },
  { day: 'T7', score: 6 },
  { day: 'CN', score: 7 },
]

const MOCK_KEYWORDS = [
  { word: 'mệt mỏi',   count: 5, color: 'bg-warning/40' },
  { word: 'lo lắng',   count: 3, color: 'bg-secondary/40' },
  { word: 'công việc', count: 4, color: 'bg-primary/40' },
  { word: 'gia đình',  count: 2, color: 'bg-accent/60' },
  { word: 'bạn bè',    count: 3, color: 'bg-primary-light' },
]

const MOOD_SCORES = {
  loved: 7,
  happy: 6,
  neutral: 4,
  sad: 2,
  anxious: 2,
  angry: 1
}

const TAG_COLORS = [
  'bg-primary/40',
  'bg-secondary/40',
  'bg-accent/60',
  'bg-primary-light',
  'bg-warning/40'
]

const STATUS_LEVELS = [
  { level: 'Bình thường', color: 'bg-green-100 text-green-700', dot: 'bg-green-400', key: 'normal' },
  { level: 'Chú ý',       color: 'bg-accent text-text-main',    dot: 'bg-yellow-400', key: 'attention' },
  { level: 'Cần hỗ trợ',  color: 'bg-warning/30 text-text-main', dot: 'bg-orange-400', key: 'needs_support' },
  { level: 'Khẩn cấp',    color: 'bg-danger/20 text-danger',    dot: 'bg-danger', key: 'critical' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const emojis = ['😡', '😰', '😔', '😐', '😌', '😊', '🥰', '✨']
  const scoreVal = payload[0].value
  return (
    <div className="bg-white rounded-2xl shadow-soft px-4 py-3 border border-primary/20">
      <p className="font-ui text-xs text-text-sub mb-1">{label}</p>
      <p className="font-body font-semibold text-text-main">
        {emojis[scoreVal] || '😊'} {scoreVal}/7
      </p>
    </div>
  )
}

export default function DashboardPage() {
  const { journals, user } = useAppStore()

  // 1. Calculate general stats
  const totalEntries = journals.length
  
  // Calculate mood scores
  const totalScores = journals.reduce((acc, j) => acc + (MOOD_SCORES[j.mood] || 4), 0)
  const averageScore = totalEntries > 0 ? (totalScores / totalEntries) : 5.0
  const formattedAvg = averageScore.toFixed(1)

  // 7-day active checkins
  const uniqueCheckinDates = new Set(journals.map(j => new Date(j.date).toDateString()))
  const last7DaysCount = Array.from(uniqueCheckinDates).filter(dateStr => {
    const checkinTime = new Date(dateStr).getTime()
    const diff = new Date().getTime() - checkinTime
    return diff <= 7 * 24 * 60 * 60 * 1000
  }).length

  // 2. Generate 7-day dynamic chart data
  const getWeeklyMoodData = () => {
    if (totalEntries === 0) return MOCK_MOOD_DATA

    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    const data = []
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dStr = d.toDateString()
      const dayName = days[d.getDay()]

      // Find journals on this day
      const dayJournals = journals.filter(j => new Date(j.date).toDateString() === dStr)
      if (dayJournals.length > 0) {
        const avgScore = dayJournals.reduce((s, j) => s + (MOOD_SCORES[j.mood] || 4), 0) / dayJournals.length
        data.push({ day: dayName, score: Math.round(avgScore) })
      } else {
        // Default to a neutral middle point for aesthetics if no entry
        data.push({ day: dayName, score: 4 })
      }
    }
    return data
  }

  const moodData = getWeeklyMoodData()

  // 3. Process trending keywords from actual tags
  const getTrendingKeywords = () => {
    if (totalEntries === 0) return MOCK_KEYWORDS

    const counts = {}
    journals.forEach(j => {
      j.tags?.forEach(tag => {
        const cleanTag = tag.trim().toLowerCase()
        if (cleanTag) {
          counts[cleanTag] = (counts[cleanTag] || 0) + 1
        }
      })
    })

    const sortedTags = Object.entries(counts)
      .map(([word, count], index) => ({
        word,
        count,
        color: TAG_COLORS[index % TAG_COLORS.length]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return sortedTags.length > 0 ? sortedTags : MOCK_KEYWORDS
  }

  const trendingKeywords = getTrendingKeywords()
  const maxCount = Math.max(...trendingKeywords.map(k => k.count), 1)

  // 4. Calculate Mental Health Status dynamically
  const getDynamicStatusKey = () => {
    if (totalEntries === 0) return 'attention' // Mock default
    if (averageScore >= 5.5) return 'normal'
    if (averageScore >= 3.8) return 'attention'
    if (averageScore >= 2.0) return 'needs_support'
    return 'critical'
  }

  const activeStatusKey = getDynamicStatusKey()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-text-main mb-1">Phân tích sức khỏe</h1>
        <p className="font-body text-text-sub">Nhìn lại hành trình cảm xúc của bạn {!user && '(Chế độ Khách)'}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Điểm TB tuần', value: `${formattedAvg}/7`, sub: averageScore >= 5.5 ? 'Trạng thái rất tốt! ✨' : 'Cần chú ý chăm sóc thêm 💆', color: 'bg-primary/20' },
          { label: 'Ngày check-in', value: `${last7DaysCount}/7`, sub: 'Hoạt động tuần này 🔥', color: 'bg-accent/60' },
          { label: 'Trang nhật ký', value: `${totalEntries}`, sub: 'Tổng cộng đã ghi 📖', color: 'bg-secondary/30' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn('card', s.color)}
          >
            <p className="font-ui text-xs text-text-sub mb-1">{s.label}</p>
            <p className="font-display text-3xl text-text-main mb-1">{s.value}</p>
            <p className="font-body text-xs text-text-sub">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Mood chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card mb-6"
      >
        <h3 className="font-display text-xl text-text-main mb-1">Tâm trạng 7 ngày qua</h3>
        <p className="font-ui text-xs text-text-sub mb-6">Thang điểm 1–7 (Cực tệ – Hạnh phúc)</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F9C6C920" />
            <XAxis dataKey="day" tick={{ fontFamily: 'DM Sans', fontSize: 12, fill: '#9B8A8A' }} axisLine={false} tickLine={false} />
            <YAxis domain={[1, 7]} tick={{ fontFamily: 'DM Sans', fontSize: 12, fill: '#9B8A8A' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#F9C6C9"
              strokeWidth={3}
              dot={{ fill: '#F0A0A5', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: '#F0A0A5' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Keywords */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="font-display text-lg text-text-main mb-4">Từ khóa nổi bật</h3>
          <div className="flex flex-col gap-3">
            {trendingKeywords.map((k, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={cn('px-3 py-1 rounded-full font-ui text-sm text-text-main capitalize', k.color)}>
                  {k.word}
                </span>
                <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-dark rounded-full transition-all duration-700"
                    style={{ width: `${(k.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="font-ui text-xs text-text-sub w-8 text-right">{k.count}x</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card"
        >
          <h3 className="font-display text-lg text-text-main mb-4">Trạng thái sức khỏe</h3>
          <div className="flex flex-col gap-2 mb-6">
            {STATUS_LEVELS.map((s, i) => {
              const isCurrent = s.key === activeStatusKey
              return (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all',
                    isCurrent ? s.color + ' ring-2 ring-offset-1 ring-text-sub/20 font-semibold scale-[1.02]' : 'bg-bg'
                  )}
                >
                  <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', s.dot)} />
                  <span className={cn('font-ui text-sm', isCurrent ? '' : 'text-text-sub')}>
                    {s.level}
                  </span>
                  {isCurrent && <Badge variant="accent" className="ml-auto text-xs">Hiện tại</Badge>}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Mia alert banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-gradient-to-r from-secondary/30 to-primary/20 border border-secondary/40"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-xl shrink-0">
            🌸
          </div>
          <div className="flex-1">
            <p className="font-display text-lg text-text-main mb-2">Mia nhận thấy...</p>
            <p className="font-body text-text-sub text-sm leading-relaxed mb-4">
              {averageScore >= 5.5 
                ? 'Gần đây tinh thần của bạn rất ổn định và tràn đầy năng lượng tích cực! Hãy tiếp tục duy trì những thói quen tốt lành này cùng Mia nhé 💛'
                : 'Dường như gần đây bạn có vẻ đang trải qua nhiều cảm xúc nặng nề hoặc áp lực. Điều này hoàn toàn bình thường, nhưng đôi khi trò chuyện với chuyên gia hoặc chia sẻ thêm với mình có thể giúp bạn rất nhiều 💙'
              }
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" size="sm" className="text-sm">Tìm hiểu thêm</Button>
              <Button size="sm" className="text-sm">Kết nối chuyên gia</Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Emergency line */}
      <p className="mt-8 text-center font-ui text-xs text-text-sub">
        🆘 Cần hỗ trợ khẩn cấp? Đường dây hỗ trợ: <strong className="text-text-main">1800 599 920</strong> (miễn phí, 24/7)
      </p>
    </div>
  )
}
