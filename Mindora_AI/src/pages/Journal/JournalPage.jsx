import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, X, Save, Tag as TagIcon, Trash2, Book } from 'lucide-react'
import Button from '../../components/atoms/Button'
import Tag from '../../components/atoms/Tag'
import { MOODS, formatDate, cn } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'
import CircularMoodPicker from '../../components/organisms/CircularMoodPicker'

const SAMPLE_JOURNALS = [
  {
    id: 'sample-1',
    date: new Date(2026, 4, 29),
    mood: 'sad',
    text: 'Hôm nay công việc áp lực nhiều, cảm thấy mệt mỏi và không có năng lượng. Tưởng mọi thứ đang tiến triển tốt nhưng lại gặp trở ngại mới...',
    tags: ['công_việc', 'stress'],
  },
  {
    id: 'sample-2',
    date: new Date(2026, 4, 27),
    mood: 'happy',
    text: 'Hôm nay đi cà phê với bạn bè, cảm giác thật nhẹ nhàng. Được nói chuyện nhiều, cười nhiều — đúng thứ mình cần.',
    tags: ['bạn_bè', 'vui_vẻ'],
  },
]

function JournalCard({ entry, onEdit, onDelete }) {
  const mood = MOODS.find(m => m.value === entry.mood)
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card border border-[#EBE6DD] bg-white hover:shadow-soft transition-shadow duration-300 relative overflow-hidden"
    >
      {/* Decorative vertical colored mood border */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-1.5" 
        style={{ backgroundColor: mood?.color || '#C97B3A' }} 
      />

      <div className="pl-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-ui text-[10px] text-text-sub uppercase tracking-wider mb-0.5">
              {formatDate(entry.date)}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xl">{mood?.emoji}</span>
              <span className="font-body text-xs text-text-main font-semibold">{mood?.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              title="Chỉnh sửa nhật ký"
              className="p-2 rounded-xl hover:bg-primary/10 text-text-sub hover:text-primary transition-colors cursor-pointer"
            >
              <Edit3 size={15} />
            </button>
            <button
              onClick={onDelete}
              title="Xóa nhật ký"
              className="p-2 rounded-xl hover:bg-red-50 text-text-sub hover:text-red-600 transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <p className={cn(
          'font-body text-text-main text-sm leading-relaxed mb-3 whitespace-pre-wrap',
          !expanded && 'line-clamp-3'
        )}>
          {entry.text}
        </p>

        {entry.text.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="font-ui text-xs font-semibold text-primary hover:underline mb-3 cursor-pointer"
          >
            {expanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        )}

        {entry.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {entry.tags.map(t => <Tag key={t} className="bg-bg text-text-sub border border-[#F2ECE2] text-[10px] py-0.5 px-2.5">{t}</Tag>)}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function WriteModal({ onClose, editEntry }) {
  const { addJournal, updateJournal, setTodayMood } = useAppStore()
  const [mood, setMood] = useState(editEntry?.mood || '')
  const [text, setText] = useState(editEntry?.text || '')
  const [tags, setTags] = useState(editEntry?.tags?.join(', ') || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!mood || !text.trim()) return
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)
    setSaving(true)

    try {
      if (editEntry) {
        await updateJournal(editEntry.id, { mood, text, tags: tagList })
      } else {
        await addJournal({ mood, text, tags: tagList })
        setTodayMood(mood)
      }
      onClose()
    } catch (error) {
      console.error('Error saving journal:', error)
      alert('Đã xảy ra lỗi khi lưu nhật ký. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-dark/30 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-bg border border-[#EBE6DD] rounded-4xl shadow-soft w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative"
      >
        {/* Sunbeam ambient gradient representing journal.jpg light */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-accent/10 to-transparent pointer-events-none rounded-tr-4xl" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <Book size={18} className="text-primary" />
            <h2 className="font-display text-xl md:text-2xl text-text-main font-bold">
              {editEntry ? 'Chỉnh sửa nhật ký' : 'Viết nhật ký hôm nay'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-primary/10 text-text-sub hover:text-text-main transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Circular Mood Picker matching Mood_Picker.jpg */}
        <div className="mb-6 flex flex-col items-center">
          <p className="font-ui text-xs text-text-sub uppercase tracking-wider mb-2 text-center">Tâm trạng của bạn hôm nay?</p>
          <CircularMoodPicker value={mood} onChange={setMood} />
        </div>

        {/* Lined Notebook Paper Editor mimicking journal.jpg */}
        <div className="mb-5">
          <label className="font-ui text-xs text-text-sub uppercase tracking-wider block mb-2">Lời tự sự của bạn</label>
          <div className="relative rounded-2xl overflow-hidden border border-[#EBE6DD] bg-white shadow-inner">
            {/* Lined notebook decoration inside text container */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Kể về ngày hôm nay của bạn... Điều gì đã xảy ra? Bạn đang nghĩ gì? Dora luôn ở đây lắng nghe."
              rows={7}
              className="w-full bg-[#FAF8F5] notebook-paper border-0 resize-none font-body text-[#3E2723] text-sm leading-8 focus:outline-none focus:ring-0 p-5 placeholder-text-sub/50"
            />
            {/* Decorative golden pen accent mimicking the wooden pen in journal.jpg */}
            <div className="absolute bottom-3 right-4 font-ui text-[10px] text-text-sub/40 pointer-events-none flex items-center gap-1.5">
              <span>✍️ Ghi lại khoảnh khắc</span>
            </div>
          </div>
          <p className="font-ui text-[10px] text-text-sub text-right mt-1.5">
            {text.length} ký tự
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-2">
            <TagIcon size={14} className="text-text-sub" />
            <p className="font-ui text-xs text-text-sub uppercase tracking-wider">Từ khóa liên quan (phân cách bằng dấu phẩy)</p>
          </div>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="ví dụ: công_việc, bạn_bè, sức_khỏe..."
            className="w-full bg-white border border-[#EBE6DD] rounded-xl px-4 py-2.5 font-body text-sm text-text-main placeholder-text-sub/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1 justify-center py-2.5 text-sm"
            onClick={onClose}
            disabled={saving}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 justify-center py-2.5 text-sm"
            icon={<Save size={14} />}
            onClick={handleSave}
            loading={saving}
            disabled={!mood || !text.trim()}
          >
            Lưu nhật ký
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function JournalPage() {
  const { journals, user, deleteJournal } = useAppStore()
  const [showModal, setShowModal] = useState(false)
  const [editEntry, setEditEntry] = useState(null)

  const allEntries = user
    ? [...journals].sort((a, b) => new Date(b.date) - new Date(a.date))
    : journals.length > 0 
      ? [...journals].sort((a, b) => new Date(b.date) - new Date(a.date))
      : [...SAMPLE_JOURNALS].sort((a, b) => new Date(b.date) - new Date(a.date))

  const todayStr = new Date().toDateString()
  const todayMoodDone = allEntries.some(
    j => new Date(j.date).toDateString() === todayStr
  )

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa trang nhật ký này?')) {
      try {
        await deleteJournal(id)
      } catch (err) {
        console.error('Delete error:', err)
        alert('Không thể xóa nhật ký lúc này.')
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-text-main font-bold">Nhật ký của bạn</h1>
          <p className="font-body text-xs text-text-sub">
            {allEntries.length} trang nhật ký {!user && '(Chế độ Khách)'}
          </p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={() => { setEditEntry(null); setShowModal(true) }}
          className="py-2.5 text-sm"
        >
          Viết hôm nay
        </Button>
      </div>

      {/* Mood check-in banner */}
      {!todayMoodDone && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/15 border border-[#EBE6DD] mb-8 cursor-pointer relative overflow-hidden"
          onClick={() => { setEditEntry(null); setShowModal(true) }}
        >
          {/* Subtle notebook pen design details on check-in banner */}
          <div className="absolute -right-8 -bottom-8 text-8xl opacity-15 rotate-12 select-none pointer-events-none">✍️</div>
          
          <p className="font-display text-base md:text-lg text-text-main font-bold mb-1">Hôm nay bạn cảm thấy thế nào?</p>
          <p className="font-body text-xs text-text-sub mb-4">Ghi lại cảm xúc hôm nay chỉ mất 1 phút để Dora đồng hành cùng bạn!</p>
          <div className="flex gap-4 relative z-10">
            {MOODS.map(m => (
              <button
                key={m.value}
                className="text-3xl hover:scale-125 transition-transform duration-200 cursor-pointer filter drop-shadow-sm"
                onClick={(e) => { e.stopPropagation(); setEditEntry(null); setShowModal(true) }}
                title={m.label}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Journal list */}
      <div className="flex flex-col gap-5">
        {allEntries.length > 0 ? (
          allEntries.map(entry => (
            <JournalCard
              key={entry.id}
              entry={entry}
              onEdit={() => { setEditEntry(entry); setShowModal(true) }}
              onDelete={() => handleDelete(entry.id)}
            />
          ))
        ) : (
          <div className="text-center py-14 card border border-[#EBE6DD] bg-white">
            <p className="text-4xl mb-3">🌸</p>
            <p className="font-display text-lg text-text-main font-semibold">Chưa có trang nhật ký nào</p>
            <p className="font-body text-xs text-text-sub mt-1.5 mb-5">Hãy bắt đầu lưu giữ cảm xúc của bạn từ hôm nay!</p>
            <Button
              icon={<Plus size={14} />}
              onClick={() => { setEditEntry(null); setShowModal(true) }}
              className="py-2.5 text-sm mx-auto"
            >
              Viết nhật ký ngay
            </Button>
          </div>
        )}
      </div>

      {/* Write modal */}
      <AnimatePresence>
        {showModal && (
          <WriteModal
            onClose={() => setShowModal(false)}
            editEntry={editEntry}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
