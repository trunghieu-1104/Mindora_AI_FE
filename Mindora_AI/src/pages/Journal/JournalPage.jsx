import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, X, Save, Tag as TagIcon, Trash2 } from 'lucide-react'
import Button from '../../components/atoms/Button'
import Tag from '../../components/atoms/Tag'
import { MOODS, formatDate, cn } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'

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

function MoodPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {MOODS.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={cn(
            'flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer',
            value === m.value
              ? 'border-primary bg-primary/30 scale-105'
              : 'border-transparent bg-white hover:bg-primary/10'
          )}
        >
          <span className="text-2xl">{m.emoji}</span>
          <span className="font-ui text-xs text-text-sub">{m.label}</span>
        </button>
      ))}
    </div>
  )
}

function JournalCard({ entry, onEdit, onDelete }) {
  const mood = MOODS.find(m => m.value === entry.mood)
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-ui text-xs text-text-sub mb-0.5">
            {formatDate(entry.date)}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xl">{mood?.emoji}</span>
            <span className="font-body text-sm text-text-main font-medium">{mood?.label}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            title="Chỉnh sửa nhật ký"
            className="p-2 rounded-xl hover:bg-primary/10 text-text-sub hover:text-text-main transition-colors cursor-pointer"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={onDelete}
            title="Xóa nhật ký"
            className="p-2 rounded-xl hover:bg-red-50 text-text-sub hover:text-red-600 transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className={cn(
        'font-body text-text-sub text-sm leading-relaxed mb-3 whitespace-pre-wrap',
        !expanded && 'line-clamp-3'
      )}>
        {entry.text}
      </p>

      {entry.text.length > 150 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="font-ui text-xs text-primary-dark hover:underline mb-3 cursor-pointer"
        >
          {expanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}

      {entry.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entry.tags.map(t => <Tag key={t}>{t}</Tag>)}
        </div>
      )}
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
        
        // Update the mood check-in for today in Zustand store
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/20 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-bg rounded-4xl shadow-soft w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-text-main">
            {editEntry ? 'Chỉnh sửa nhật ký' : 'Viết nhật ký hôm nay'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-primary/10 text-text-sub transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="font-ui text-sm text-text-sub mb-3">Tâm trạng của bạn hôm nay?</p>
          <MoodPicker value={mood} onChange={setMood} />
        </div>

        <div className="mb-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Kể về ngày hôm nay của bạn... Điều gì đã xảy ra? Bạn đang nghĩ gì?"
            rows={8}
            className="input-field resize-none text-base leading-relaxed"
          />
          <p className="font-ui text-xs text-text-sub text-right mt-1">
            {text.length} ký tự
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon size={14} className="text-text-sub" />
            <p className="font-ui text-sm text-text-sub">Tags (cách nhau bởi dấu phẩy)</p>
          </div>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="công_việc, gia_đình, sức_khỏe..."
            className="input-field"
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1 justify-center"
            onClick={onClose}
            disabled={saving}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 justify-center"
            icon={<Save size={16} />}
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

  // Only display mock data for guests who haven't written anything
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
          <h1 className="font-display text-3xl text-text-main mb-1">Nhật ký của bạn</h1>
          <p className="font-body text-text-sub text-sm">
            {allEntries.length} trang nhật ký {!user && '(Chế độ Khách)'}
          </p>
        </div>
        <Button
          icon={<Plus size={18} />}
          onClick={() => { setEditEntry(null); setShowModal(true) }}
        >
          Viết hôm nay
        </Button>
      </div>

      {/* Mood check-in banner */}
      {!todayMoodDone && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-primary/20 to-secondary/20 mb-6 cursor-pointer"
          onClick={() => { setEditEntry(null); setShowModal(true) }}
        >
          <p className="font-display text-lg text-text-main mb-1">Hôm nay bạn cảm thấy thế nào?</p>
          <p className="font-body text-text-sub text-sm mb-4">Ghi lại cảm xúc hôm nay chỉ mất 1 phút thôi!</p>
          <div className="flex gap-3">
            {MOODS.map(m => (
              <button
                key={m.value}
                className="text-2xl hover:scale-125 transition-transform duration-200 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setShowModal(true) }}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Journal list */}
      <div className="flex flex-col gap-4">
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
          <div className="text-center py-12 card bg-white">
            <p className="text-4xl mb-2">🌸</p>
            <p className="font-display text-lg text-text-main font-semibold">Chưa có trang nhật ký nào</p>
            <p className="font-body text-text-sub text-sm mt-1 mb-4">Hãy bắt đầu lưu giữ cảm xúc của bạn từ hôm nay!</p>
            <Button
              icon={<Plus size={16} />}
              onClick={() => { setEditEntry(null); setShowModal(true) }}
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
