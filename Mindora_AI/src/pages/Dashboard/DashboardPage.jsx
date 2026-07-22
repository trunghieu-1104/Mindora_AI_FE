import { useEffect, useState } from 'react'
import {
  ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { ArrowLeft, Info, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { MOODS } from '../../lib/utils'

const MOOD_SCORES = {
  loved: 7,
  happy: 6,
  neutral: 4,
  sad: 2,
  anxious: 2,
  angry: 1
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const emojis = ['😡', '😰', '😔', '😐', '😌', '😊', '🥰', '✨']
  const scoreVal = payload.find(p => p.dataKey === 'score')?.value || 4
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-soft px-4 py-3 border border-primary/20">
      <p className="font-ui text-xs text-text-sub mb-1">{label}</p>
      <p className="font-body font-semibold text-text-main">
        {emojis[scoreVal] || '😊'} {scoreVal}/7
      </p>
    </div>
  )
}

// Popup ăn mừng khi user lên Level mới hoặc mở Achievement mới — tạo cảm giác "phần thưởng" rõ
// ràng ngay lúc mở Dashboard, thay vì chỉ là con số tĩnh nằm trong card.
const CelebrationModal = ({ celebration, onClose }) => {
  if (!celebration) return null
  const { leveledUp, newLevel, achievement } = celebration
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full bg-white rounded-3xl p-7 text-center shadow-2xl animate-[bounce_0.6s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-bg text-text-sub hover:text-text-main cursor-pointer"
        >
          <X size={16} />
        </button>

        <p className="text-5xl mb-3">{achievement ? '🏆' : '🎉'}</p>
        <h3 className="font-display text-xl text-text-main font-bold mb-2">
          {achievement && leveledUp ? 'Một ngày tuyệt vời!' : achievement ? 'Mở khóa huy hiệu mới!' : 'Lên cấp rồi!'}
        </h3>

        <div className="flex flex-col gap-3 mt-4">
          {leveledUp && (
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
              <p className="font-body text-sm text-text-main">⭐ Bạn đã đạt <span className="font-bold text-primary">Level {newLevel}</span></p>
            </div>
          )}
          {achievement && (
            <div className="bg-[#FFF4D6] border border-[#F0E2B0] rounded-2xl p-4 text-left">
              <p className="font-body font-semibold text-sm text-text-main">🏅 {achievement.title}</p>
              <p className="font-body text-xs text-text-sub mt-1 leading-relaxed">{achievement.description}</p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-full font-ui text-sm font-semibold transition-colors cursor-pointer"
        >
          Tuyệt vời!
        </button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const {
    journals, loadJournals, moodLogs, loadMoodWeek,
    dailyInsight, loadDailyInsight,
    achievements, loadAchievements,
    weeklySummary, loadWeeklySummary,
    moodHistory, loadMoodHistory,
    user,
  } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [showAllAchievements, setShowAllAchievements] = useState(false)
  const [showAllMoodHistory, setShowAllMoodHistory] = useState(false)
  const [celebration, setCelebration] = useState(null)

  // Load data từ backend khi mount
  useEffect(() => {
    if (!user) return
    const load = async () => {
      setLoading(true)
      await Promise.all([loadJournals(), loadMoodWeek(), loadDailyInsight(), loadAchievements(), loadWeeklySummary(), loadMoodHistory(30)])
      setLoading(false)
    }
    load()
  }, [user])

  // Popup ăn mừng khi lên Level mới hoặc mở Achievement mới trong hôm nay — chỉ hiện 1 lần/ngày
  // (đánh dấu bằng localStorage theo user + ngày, tránh làm phiền khi mở lại Dashboard nhiều lần).
  useEffect(() => {
    if (!dailyInsight?.available || !user) return
    const seenKey = `mindora_celebration_seen_${user.id}_${dailyInsight.date}`
    if (localStorage.getItem(seenKey)) return

    const xp = dailyInsight.xpInfo
    const levelBefore = xp ? Math.floor(Math.max(0, xp.totalXp - xp.xpEarnedToday) / 100) + 1 : 1
    const leveledUp = xp && xp.level > levelBefore
    const achievementUnlocked = dailyInsight.achievement?.unlockedToday

    if (leveledUp || achievementUnlocked) {
      setCelebration({
        leveledUp,
        newLevel: xp?.level,
        achievement: achievementUnlocked ? dailyInsight.achievement : null,
      })
      localStorage.setItem(seenKey, '1')
    }
  }, [dailyInsight, user])

  // Tính stats từ mood logs thật (từ backend)
  const totalMoodEntries = moodLogs.length
  const totalMoodScore = moodLogs.reduce((acc, m) => acc + (m.moodScore || 4), 0)
  const averageMoodScore = totalMoodEntries > 0 ? (totalMoodScore / totalMoodEntries) : 4.5

  // Fallback: nếu chưa có mood logs, tính từ journals
  const totalEntries = journals.length
  const journalScores = journals.reduce((acc, j) => acc + (MOOD_SCORES[j.mood] || 4), 0)
  const journalAvg = totalEntries > 0 ? (journalScores / totalEntries) : 4.5

  const displayAvg = totalMoodEntries > 0 ? averageMoodScore : journalAvg
  const formattedAvg = displayAvg.toFixed(2)

  // Calculate check-ins count in last 7 days
  const last7DaysCount = moodLogs.length > 0
    ? new Set(moodLogs.map(m => m.logDate)).size
    : new Set(journals.map(j => new Date(j.date).toDateString())).size

  // Generate 7-day chart data từ mood logs backend
  const getWeeklyMoodData = () => {
    if (moodLogs.length > 0) {
      // Dùng mood logs thật từ backend
      const data = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dayIdx = d.getDay()
        const dayName = dayIdx === 0 ? 'CN' : `T${dayIdx + 1}`
        const dateStr = d.toISOString().split('T')[0]

        const dayLog = moodLogs.find(m => m.logDate === dateStr)
        data.push({
          day: dayName,
          score: dayLog ? dayLog.moodScore : 4.0
        })
      }
      return data
    }

    // Fallback: dùng journals
    const data = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dStr = d.toDateString()
      const dayIdx = d.getDay()
      const dayName = dayIdx === 0 ? 'CN' : `T${dayIdx + 1}`

      const dayJournals = journals.filter(j => new Date(j.date).toDateString() === dStr)
      if (dayJournals.length > 0) {
        const avgScore = dayJournals.reduce((s, j) => s + (MOOD_SCORES[j.mood] || 4), 0) / dayJournals.length
        data.push({ day: dayName, score: avgScore })
      } else {
        data.push({ day: dayName, score: 0 })
      }
    }
    return data
  }

  const baseMoodData = getWeeklyMoodData()

  // Decompose scores into three stacked areas for wave layers (terracotta, peach, warm cream)
  const chartData = baseMoodData.map(d => {
    const score = d.score
    const terracotta = Math.min(score, 2.5)
    const peach = Math.min(Math.max(score - 2.5, 0), 2.5)
    const cream = Math.max(score - 5.0, 0)
    return { day: d.day, score, terracotta, peach, cream }
  })

  // Get recent journals (top 4)
  const recentJournals = [...journals]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4)

  if (loading && user) {
    return (
      <div className="min-h-screen bg-bg py-10 px-4 md:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl mb-2">⏳</p>
          <p className="font-body text-sm text-text-sub">Đang tải dữ liệu phân tích...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg py-10 px-4 md:px-8">
      <CelebrationModal celebration={celebration} onClose={() => setCelebration(null)} />

      {/* Outer elegant picture frame wrapper mimicking Insight.jpg */}
      <div className="max-w-6xl mx-auto border-[16px] border-[#E4D9B8]/30 rounded-[2.5rem] bg-[#FBF7ED] shadow-soft p-6 md:p-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ─── LEFT SIDEBAR PANEL (4 cols) ────────────────────── */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#FBF7EC] border border-[#E8E1CF] rounded-3xl p-6 shadow-sm">
              <h2 className="font-display text-xl text-text-main font-semibold mb-6 border-b border-primary/10 pb-3">
                Chỉ số tâm lý
              </h2>

              <div className="flex flex-col gap-5">
                {/* Metric 1 */}
                <div className="bg-white/80 border border-[#F0EBDC] rounded-2xl p-4 shadow-inner">
                  <span className="font-ui text-xs text-text-sub uppercase tracking-wider block mb-1">Điểm TB tuần này</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl text-primary font-bold">{formattedAvg}</span>
                    <span className="font-ui text-sm text-text-sub">/7.00</span>
                  </div>
                  <p className="font-body text-xs text-text-sub mt-2">
                    {displayAvg >= 5.5 ? 'Tinh thần xuất sắc! ✨' : displayAvg >= 4.0 ? 'Bình thản và cân bằng 😌' : 'Cần nghỉ ngơi nhiều hơn 💙'}
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="bg-white/80 border border-[#F0EBDC] rounded-2xl p-4 shadow-inner">
                  <span className="font-ui text-xs text-text-sub uppercase tracking-wider block mb-1">Tổng nhật ký</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl text-secondary font-bold">{totalEntries}</span>
                    <span className="font-ui text-xs text-text-sub">bản ghi</span>
                  </div>
                  <p className="font-body text-xs text-text-sub mt-2">Đã được mã hóa & lưu trữ an toàn</p>
                </div>

                {/* Metric 3 */}
                <div className="bg-white/80 border border-[#F0EBDC] rounded-2xl p-4 shadow-inner">
                  <span className="font-ui text-xs text-text-sub uppercase tracking-wider block mb-1">Chỉ số check-in</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl text-primary font-bold">{last7DaysCount}</span>
                    <span className="font-ui text-xs text-text-sub">/ 7 ngày qua</span>
                  </div>
                  <p className="font-body text-xs text-text-sub mt-2">Duy trì thói quen giúp tâm lý ổn định</p>
                </div>

                {/* Metric 4 */}
                <div className="bg-white/80 border border-[#F0EBDC] rounded-2xl p-4 shadow-inner">
                  <span className="font-ui text-xs text-text-sub uppercase tracking-wider block mb-1">Mood logs tuần này</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl text-text-main font-bold">{totalMoodEntries}</span>
                    <span className="font-ui text-xs text-text-sub">lần ghi nhận</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ─── MAIN CONTENT AREA (8 cols) ─────────────────────── */}
          <main className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Header section with back option */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.history.back()}
                  className="p-2.5 rounded-full bg-white hover:bg-primary-light border border-[#E8E1CF] text-text-main hover:text-primary transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl text-text-main font-bold">Wellness Insight</h1>
                  <p className="font-body text-xs text-text-sub">Phân tích biểu đồ và xu hướng cảm xúc</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {dailyInsight?.dailyTitle && (
                  <span className="font-ui text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
                    ✨ {dailyInsight.dailyTitle}
                  </span>
                )}
                <Link
                  to="/dashboard/guide"
                  title="Giải thích Level, Streak, Cây cảm xúc..."
                  className="p-2 rounded-full bg-white hover:bg-primary-light border border-[#E8E1CF] text-text-sub hover:text-primary transition-colors cursor-pointer"
                >
                  <Info size={16} />
                </Link>
              </div>
            </div>

            {/* 💡 AI INSIGHT HÔM NAY — điểm nhấn chính, đặt ngay dưới tiêu đề Wellness Insight */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary to-[#123152] rounded-3xl p-6 shadow-md">
              <div className="absolute -right-6 -top-6 text-8xl opacity-10 select-none">💡</div>
              <h3 className="font-display text-lg text-white font-semibold mb-2 relative">💡 AI Insight hôm nay</h3>

              {dailyInsight?.available ? (
                <>
                  <p className="font-body text-sm text-white/95 leading-relaxed relative">{dailyInsight.insight}</p>
                  {dailyInsight.nextTip && (
                    <p className="font-ui text-xs text-white/75 mt-3 relative">🌤️ Gợi ý cho ngày mai: {dailyInsight.nextTip}</p>
                  )}
                </>
              ) : (
                <div className="relative">
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Trò chuyện cùng Dora hôm nay để nhận nhận xét riêng dành cho bạn — AI sẽ đọc lại đoạn
                    chat và cho bạn biết hôm nay có gì đặc biệt. 💬
                  </p>
                  <Link
                    to="/chat"
                    className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full bg-white text-primary font-ui text-xs font-semibold hover:bg-white/90 transition-colors cursor-pointer"
                  >
                    💬 Trò chuyện với Dora ngay
                  </Link>
                </div>
              )}
            </div>

            {/* GAMIFICATION ROW: XP, Streak/Pet, Cây cảm xúc, Achievement */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* ⭐ XP / Level */}
              <div className="bg-white border border-[#E8E1CF] rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                <span className="font-ui text-[11px] text-text-sub uppercase tracking-wider">⭐ Level {dailyInsight?.xpInfo?.level ?? 1}</span>
                <div className="w-full h-2 rounded-full bg-[#F0EBDC] overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((100 * (dailyInsight?.xpInfo?.xpIntoLevel ?? 0)) / (dailyInsight?.xpInfo?.xpForNextLevel || 100)))}%`
                    }}
                  />
                </div>
                <span className="font-body text-xs text-text-sub">
                  {dailyInsight?.xpInfo?.xpEarnedToday ? `+${dailyInsight.xpInfo.xpEarnedToday} XP hôm nay` : `${dailyInsight?.xpInfo?.totalXp ?? 0} XP tích lũy`}
                </span>
              </div>

              {/* 🔥 Streak + 🐱 Pet */}
              <div className="bg-white border border-[#E8E1CF] rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                <span className="font-ui text-[11px] text-text-sub uppercase tracking-wider">
                  🔥 {dailyInsight?.streak?.title || 'Chuỗi đồng hành'}
                </span>
                <span className="font-display text-2xl text-primary font-bold">{dailyInsight?.streak?.currentStreak ?? 0} ngày</span>
                <span className="font-body text-xs text-text-sub leading-snug">
                  🐱 {dailyInsight?.petMessage || 'Momo đang chờ nghe bạn kể chuyện hôm nay.'}
                </span>
              </div>

              {/* 🌱 Cây cảm xúc */}
              <div className="bg-white border border-[#E8E1CF] rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                <span className="font-ui text-[11px] text-text-sub uppercase tracking-wider">🌱 Cây cảm xúc</span>
                <span className="font-display text-2xl text-secondary font-bold">
                  {dailyInsight?.tree?.percent ?? 0}%
                  {dailyInsight?.tree?.deltaToday ? (
                    <span className="font-ui text-xs text-secondary/70 font-normal ml-1">+{dailyInsight.tree.deltaToday}% hôm nay</span>
                  ) : null}
                </span>
                <span className="font-body text-xs text-text-sub">{dailyInsight?.tree?.treeCount ?? 0} cây đã trưởng thành</span>
              </div>

              {/* 🏆 Achievement */}
              <div className="bg-white border border-[#E8E1CF] rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                <span className="font-ui text-[11px] text-text-sub uppercase tracking-wider">🏆 Achievement</span>
                {dailyInsight?.achievement?.unlockedToday ? (
                  <>
                    <span className="font-body font-semibold text-xs text-text-main">🏅 {dailyInsight.achievement.title}</span>
                    <span className="font-body text-[11px] text-text-sub leading-snug">{dailyInsight.achievement.description}</span>
                  </>
                ) : (
                  <span className="font-body text-xs text-text-sub leading-snug">Chưa có thành tựu mới hôm nay — mỗi bước cố gắng đều được ghi nhận.</span>
                )}
              </div>
            </div>

            {/* STACKED AREA CHART WAVES */}
            <div className="bg-white border border-[#E8E1CF] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg text-text-main font-medium">Xu Hướng Cảm Xúc</h3>
                  <p className="font-ui text-[11px] text-text-sub">Phân rã các tầng năng lượng cảm xúc theo 7 ngày qua</p>
                </div>
                <div className="flex gap-4 text-xs font-ui">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1E4E79]" /> Tích cực</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" /> Bình yên</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F0E2B0]" /> Nhẹ nhõm</span>
                </div>
              </div>

              {/* Chart Container */}
              <div className="h-64 md:h-72 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaTerracotta" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E4E79" stopOpacity={0.85}/>
                        <stop offset="95%" stopColor="#1E4E79" stopOpacity={0.4}/>
                      </linearGradient>
                      <linearGradient id="areaPeach" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A227" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#C9A227" stopOpacity={0.3}/>
                      </linearGradient>
                      <linearGradient id="areaCream" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F0E2B0" stopOpacity={0.75}/>
                        <stop offset="95%" stopColor="#F0E2B0" stopOpacity={0.25}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#E8E1CF" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#6B7686' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 7]}
                      tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#6B7686' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    <Area type="monotone" dataKey="terracotta" stackId="1" stroke="none" fill="url(#areaTerracotta)" />
                    <Area type="monotone" dataKey="peach" stackId="1" stroke="none" fill="url(#areaPeach)" />
                    <Area type="monotone" dataKey="cream" stackId="1" stroke="none" fill="url(#areaCream)" />

                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#123152"
                      strokeWidth={3}
                      dot={{ fill: '#1E4E79', stroke: '#fff', strokeWidth: 1.5, r: 4 }}
                      activeDot={{ r: 6, stroke: '#123152', strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center font-ui text-[11px] text-text-sub mt-4">7 days analytics</p>
            </div>

            {/* 📅 LỊCH SỬ MOOD — danh sách chi tiết từng lần check-in (30 ngày gần nhất), khác với
                biểu đồ xu hướng ở trên vốn chỉ tóm tắt 7 ngày dưới dạng đường/vùng. */}
            <div className="bg-white border border-[#E8E1CF] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-lg text-text-main font-medium">📅 Lịch sử mood</h3>
                {moodHistory.length > 6 && (
                  <button
                    onClick={() => setShowAllMoodHistory((v) => !v)}
                    className="font-ui text-[11px] text-primary hover:underline cursor-pointer shrink-0"
                  >
                    {showAllMoodHistory ? 'Thu gọn' : `Xem tất cả (${moodHistory.length})`}
                  </button>
                )}
              </div>
              <p className="font-ui text-[11px] text-text-sub mb-4">30 ngày gần nhất — từng lần bạn ghi nhận cảm xúc.</p>

              {moodHistory.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                  {[...moodHistory]
                    .sort((a, b) => new Date(b.logDate) - new Date(a.logDate))
                    .slice(0, showAllMoodHistory ? moodHistory.length : 6)
                    .map((m) => (
                      <div key={m.id} className="flex items-center gap-3 bg-bg/50 border border-[#F0EBDC] rounded-2xl p-3">
                        <span className="text-xl shrink-0">{m.moodEmoji || '😌'}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-body font-semibold text-xs text-text-main">{m.moodScore}/7</span>
                            <span className="font-ui text-[10px] text-text-sub shrink-0">
                              {new Date(m.logDate).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          {m.note && (
                            <p className="font-body text-[11px] text-text-sub leading-relaxed truncate mt-0.5">{m.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-2xl mb-1">📅</p>
                  <p className="font-ui text-xs text-text-sub">Chưa có lịch sử mood — hãy check-in cảm xúc để bắt đầu ghi lại.</p>
                </div>
              )}
            </div>

            {/* TỔNG KẾT TUẦN + BỘ SƯU TẬP HUY HIỆU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 📅 Tổng kết tuần */}
              <div className="bg-white border border-[#E8E1CF] rounded-3xl p-6 shadow-sm">
                <h4 className="font-display text-base text-text-main font-semibold mb-1">📅 Tổng kết tuần</h4>
                <p className="font-body text-xs text-text-sub leading-relaxed mb-4">7 ngày gần nhất — nhìn lại chặng đường thay vì chỉ hôm nay.</p>

                {weeklySummary && weeklySummary.activeDays > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-bg/50 rounded-2xl p-3">
                      <span className="font-display text-xl text-primary font-bold block">{weeklySummary.totalXpEarned}</span>
                      <span className="font-ui text-[10px] text-text-sub uppercase tracking-wider">XP kiếm được</span>
                    </div>
                    <div className="bg-bg/50 rounded-2xl p-3">
                      <span className="font-display text-xl text-secondary font-bold block">{weeklySummary.activeDays}/7</span>
                      <span className="font-ui text-[10px] text-text-sub uppercase tracking-wider">Ngày hoạt động</span>
                    </div>
                    <div className="bg-bg/50 rounded-2xl p-3">
                      <span className="font-display text-xl text-text-main font-bold block">+{weeklySummary.treeGrowthTotal}%</span>
                      <span className="font-ui text-[10px] text-text-sub uppercase tracking-wider">Cây cảm xúc</span>
                    </div>
                    <div className="bg-bg/50 rounded-2xl p-3">
                      <span className="font-display text-xl text-primary font-bold block">{weeklySummary.achievementsUnlocked}</span>
                      <span className="font-ui text-[10px] text-text-sub uppercase tracking-wider">Huy hiệu mới</span>
                    </div>
                    {weeklySummary.bestDayTitle && (
                      <div className="col-span-2 bg-primary/5 border border-primary/10 rounded-2xl p-3">
                        <span className="font-ui text-[10px] text-text-sub uppercase tracking-wider block mb-0.5">Ngày nổi bật nhất</span>
                        <span className="font-body font-semibold text-xs text-text-main">✨ {weeklySummary.bestDayTitle}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-2xl mb-1">📅</p>
                    <p className="font-ui text-xs text-text-sub">Chưa có dữ liệu tuần này — trò chuyện cùng Dora để bắt đầu nhé.</p>
                  </div>
                )}
              </div>

              {/* 🏅 Bộ sưu tập huy hiệu — chỉ tính trong tháng hiện tại, sang tháng mới sẽ reset lại */}
              <div className="bg-white border border-[#E8E1CF] rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-display text-base text-text-main font-semibold">🏅 Huy hiệu tháng này</h4>
                  {achievements.length > 4 && (
                    <button
                      onClick={() => setShowAllAchievements((v) => !v)}
                      className="font-ui text-[11px] text-primary hover:underline cursor-pointer shrink-0"
                    >
                      {showAllAchievements ? 'Thu gọn' : `Xem tất cả (${achievements.length})`}
                    </button>
                  )}
                </div>
                <p className="font-body text-xs text-text-sub leading-relaxed mb-4">Những cột mốc bạn vượt qua trong tháng — sang tháng mới sẽ bắt đầu lại từ đầu.</p>

                {achievements.length > 0 ? (
                  <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                    {(showAllAchievements ? achievements : achievements.slice(0, 4)).map((a, idx) => (
                      <div key={`${a.date}-${idx}`} className="flex items-start gap-2.5 bg-[#FFF4D6]/60 border border-[#F0E2B0] rounded-2xl p-3">
                        <span className="text-lg shrink-0">🏅</span>
                        <div className="min-w-0">
                          <p className="font-body font-semibold text-xs text-text-main truncate">{a.title}</p>
                          <p className="font-body text-[11px] text-text-sub leading-relaxed">{a.description}</p>
                          <p className="font-ui text-[10px] text-text-sub/70 mt-0.5">{new Date(a.date).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-2xl mb-1">🏅</p>
                    <p className="font-ui text-xs text-text-sub">Chưa có huy hiệu nào — hãy tiếp tục trò chuyện mỗi ngày!</p>
                  </div>
                )}
              </div>
            </div>

            {/* THREE LOWER WIDGET CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Period Checkin */}
              <div className="bg-white border border-[#E8E1CF] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-display text-base text-text-main font-semibold mb-1">Period Checkin</h4>
                  <p className="font-body text-xs text-text-sub leading-relaxed">Tần suất và mật độ ghi nhật ký cảm xúc cá nhân của bạn trong tuần.</p>
                </div>
                
                <div className="flex items-center gap-6 mt-6">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center font-display text-2xl text-white font-bold shadow-md shadow-primary/20 shrink-0">
                    {last7DaysCount}
                  </div>
                  <div>
                    <span className="font-ui text-xs text-text-sub uppercase tracking-wider block">Điểm tuần</span>
                    <span className="font-body font-bold text-text-main text-sm">
                      {last7DaysCount >= 5 ? 'Ghi chép đều đặn' : last7DaysCount >= 3 ? 'Khá ổn' : 'Cần cải thiện'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Recent Mood Statistics */}
              <div className="bg-white border border-[#E8E1CF] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-display text-base text-text-main font-semibold mb-1">Senti Anterior</h4>
                  <p className="font-body text-xs text-text-sub leading-relaxed">Mức cân bằng cảm xúc dựa trên phản hồi của cuộc trò chuyện và nhật ký gần đây.</p>
                </div>

                <div className="flex items-center gap-10 mt-6">
                  <div>
                    <span className="font-display text-3xl text-secondary font-bold block">
                      {totalMoodEntries > 0 
                        ? Math.round((moodLogs.filter(m => m.moodScore >= 5).length / totalMoodEntries) * 100) 
                        : totalEntries > 0 
                          ? Math.round((journals.filter(j => ['happy', 'loved'].includes(j.mood)).length / totalEntries) * 100)
                          : 0
                      }
                    </span>
                    <span className="font-ui text-[10px] text-text-sub uppercase tracking-wider">Tần suất tích cực (%)</span>
                  </div>
                  <div>
                    <span className="font-display text-3xl text-primary font-bold block">{formattedAvg}</span>
                    <span className="font-ui text-[10px] text-text-sub uppercase tracking-wider">Cân bằng tâm lý</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Card 3: Recent Journals Activity list */}
            <div className="bg-white border border-[#E8E1CF] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-primary/5 pb-2">
                <h4 className="font-display text-base text-text-main font-semibold">Lịch sử nhật ký hoạt động</h4>
                <span className="font-ui text-xs text-text-sub">Gần đây</span>
              </div>

              <div className="flex flex-col gap-3">
                {recentJournals.length > 0 ? (
                  recentJournals.map((j) => {
                    const moodObj = MOODS.find((m) => m.value === j.mood)
                    return (
                      <div 
                        key={j.id} 
                        className="flex items-center justify-between gap-4 p-3 bg-bg/50 rounded-2xl border border-[#F0EBDC] hover:bg-bg transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xl shrink-0">{moodObj?.emoji || '😌'}</span>
                          <div className="min-w-0">
                            <p className="font-body font-medium text-xs text-text-main truncate">{j.text}</p>
                            <p className="font-ui text-[10px] text-text-sub">{new Date(j.date).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => window.location.href = '/journal'}
                          className="px-3.5 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full font-ui text-[10px] font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 shrink-0"
                        >
                          Xem
                        </button>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-6">
                    <p className="text-2xl mb-1">📖</p>
                    <p className="font-ui text-xs text-text-sub">Chưa có nhật ký nào để phân tích.</p>
                  </div>
                )}
              </div>
            </div>

          </main>

        </div>

      </div>

    </div>
  )
}
