import { useEffect, useState } from 'react'
import {
  ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { ArrowLeft } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { MOODS, cn } from '../../lib/utils'

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

export default function DashboardPage() {
  const { journals, loadJournals, moodLogs, loadMoodWeek, user } = useAppStore()
  const [loading, setLoading] = useState(true)

  // Load data từ backend khi mount
  useEffect(() => {
    if (!user) return
    const load = async () => {
      setLoading(true)
      await Promise.all([loadJournals(), loadMoodWeek()])
      setLoading(false)
    }
    load()
  }, [user])

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
    if (totalEntries > 0) {
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
          data.push({ day: dayName, score: 4.0 })
        }
      }
      return data
    }

    // Mock data nếu chưa có gì
    return [
      { day: 'T2', score: 6 }, { day: 'T3', score: 4 }, { day: 'T4', score: 5 },
      { day: 'T5', score: 3 }, { day: 'T6', score: 4 }, { day: 'T7', score: 6 },
      { day: 'CN', score: 7 },
    ]
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
      {/* Outer elegant picture frame wrapper mimicking Insight.jpg */}
      <div className="max-w-6xl mx-auto border-[16px] border-[#B9CFE8]/30 rounded-[2.5rem] bg-[#F2F7FD] shadow-soft p-6 md:p-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ─── LEFT SIDEBAR PANEL (4 cols) ────────────────────── */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#F3F8FE] border border-[#DCE7F5] rounded-3xl p-6 shadow-sm">
              <h2 className="font-display text-xl text-text-main font-semibold mb-6 border-b border-primary/10 pb-3">
                Chỉ số tâm lý
              </h2>

              <div className="flex flex-col gap-5">
                {/* Metric 1 */}
                <div className="bg-white/80 border border-[#E6EFFB] rounded-2xl p-4 shadow-inner">
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
                <div className="bg-white/80 border border-[#E6EFFB] rounded-2xl p-4 shadow-inner">
                  <span className="font-ui text-xs text-text-sub uppercase tracking-wider block mb-1">Tổng nhật ký</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl text-secondary font-bold">{totalEntries}</span>
                    <span className="font-ui text-xs text-text-sub">bản ghi</span>
                  </div>
                  <p className="font-body text-xs text-text-sub mt-2">Đã được mã hóa & lưu trữ an toàn</p>
                </div>

                {/* Metric 3 */}
                <div className="bg-white/80 border border-[#E6EFFB] rounded-2xl p-4 shadow-inner">
                  <span className="font-ui text-xs text-text-sub uppercase tracking-wider block mb-1">Chỉ số check-in</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl text-primary font-bold">{last7DaysCount}</span>
                    <span className="font-ui text-xs text-text-sub">/ 7 ngày qua</span>
                  </div>
                  <p className="font-body text-xs text-text-sub mt-2">Duy trì thói quen giúp tâm lý ổn định</p>
                </div>

                {/* Metric 4 */}
                <div className="bg-white/80 border border-[#E6EFFB] rounded-2xl p-4 shadow-inner">
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
                  className="p-2.5 rounded-full bg-white hover:bg-primary-light border border-[#DCE7F5] text-text-main hover:text-primary transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl text-text-main font-bold">Wellness Insight</h1>
                  <p className="font-body text-xs text-text-sub">Phân tích biểu đồ và xu hướng cảm xúc</p>
                </div>
              </div>
            </div>

            {/* STACKED AREA CHART WAVES */}
            <div className="bg-white border border-[#DCE7F5] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg text-text-main font-medium">Xu Hướng Cảm Xúc</h3>
                  <p className="font-ui text-[11px] text-text-sub">Phân rã các tầng năng lượng cảm xúc theo 7 ngày qua</p>
                </div>
                <div className="flex gap-4 text-xs font-ui">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Tích cực</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" /> Bình yên</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FDE68A]" /> Nhẹ nhõm</span>
                </div>
              </div>

              {/* Chart Container */}
              <div className="h-64 md:h-72 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaTerracotta" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.85}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.4}/>
                      </linearGradient>
                      <linearGradient id="areaPeach" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EAB308" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EAB308" stopOpacity={0.3}/>
                      </linearGradient>
                      <linearGradient id="areaCream" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FDE68A" stopOpacity={0.75}/>
                        <stop offset="95%" stopColor="#FDE68A" stopOpacity={0.25}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#DCE7F5" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#5B6B85' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 7]}
                      tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#5B6B85' }}
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
                      stroke="#1E3A8A"
                      strokeWidth={3}
                      dot={{ fill: '#2563EB', stroke: '#fff', strokeWidth: 1.5, r: 4 }}
                      activeDot={{ r: 6, stroke: '#1E3A8A', strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center font-ui text-[11px] text-text-sub mt-4">7 days analytics</p>
            </div>

            {/* THREE LOWER WIDGET CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Period Checkin */}
              <div className="bg-white border border-[#DCE7F5] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
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
              <div className="bg-white border border-[#DCE7F5] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
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
            <div className="bg-white border border-[#DCE7F5] rounded-3xl p-6 shadow-sm">
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
                        className="flex items-center justify-between gap-4 p-3 bg-bg/50 rounded-2xl border border-[#E6EFFB] hover:bg-bg transition-colors"
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
