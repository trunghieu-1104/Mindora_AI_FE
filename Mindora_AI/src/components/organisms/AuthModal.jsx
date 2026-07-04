import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react'
import Button from '../atoms/Button'
import { useAppStore } from '../../store/useAppStore'
import { cn } from '../../lib/utils'

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }) {
  const { login, signup } = useAppStore()
  const [mode, setMode] = useState(defaultMode) // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await signup(email, password, displayName)
      }
      onClose()
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Safety check for Server-Side Rendering (SSR) environments
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-text-main/45 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-4xl shadow-soft w-full max-w-4xl overflow-hidden relative border border-primary/20 flex flex-col md:flex-row min-h-[500px]"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border border-primary/10 shadow-sm text-text-sub hover:bg-primary/10 hover:text-text-main hover:rotate-90 transition-all duration-300 cursor-pointer z-20"
            >
              <X size={16} />
            </button>

            {/* Left Side: Form Column */}
            <div className="flex-1 p-6 md:p-10 flex flex-col justify-center bg-white">
              {/* Header */}
              <div className="mb-6 mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <img src="/LogoDora.png" alt="Mindora" className="w-8 h-8 object-contain" />
                  <span className="font-ui text-xs font-semibold text-primary uppercase tracking-wider">Mindora</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-text-main flex items-center gap-2">
                  {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
                </h2>
                <p className="font-body text-xs text-text-sub mt-1 leading-relaxed">
                  {mode === 'login'
                    ? 'Chào mừng bạn quay trở lại với người đồng hành Dora'
                    : 'Bắt đầu hành trình cân bằng sức khỏe tâm lý của bạn'}
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2 text-red-700 text-xs font-medium"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{error}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {mode === 'signup' && (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Tên hiển thị của bạn"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="input-field pl-12 bg-[#FBF7ED]/40 border-primary/20 focus:bg-white"
                    />
                  </div>
                )}

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="Email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-12 bg-[#FBF7ED]/40 border-primary/20 focus:bg-white"
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-12 bg-[#FBF7ED]/40 border-primary/20 focus:bg-white"
                  />
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  loading={loading}
                  className="w-full justify-center mt-2 text-sm cursor-pointer"
                >
                  {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 mt-6">
                <span className="flex-1 h-px bg-primary/10" />
                <span className="font-ui text-[11px] text-text-sub/70 uppercase tracking-wider">hoặc</span>
                <span className="flex-1 h-px bg-primary/10" />
              </div>

              {/* Switch Mode Footer */}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login')
                  setError(null)
                }}
                className="w-full mt-4 py-3 rounded-2xl border border-primary/20 text-text-sub font-ui text-sm hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 cursor-pointer"
              >
                {mode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản rồi? '}
                <span className="text-primary font-semibold">
                  {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập tại đây'}
                </span>
              </button>
            </div>


            {/* Right Side: Animated Brand Image Column */}
            <div className="hidden md:flex flex-1 relative bg-secondary-dark overflow-hidden">
              {/* Ken Burns zoom + slide animation on background.png */}
              <div 
                className="absolute inset-0 bg-[url('/background.png')] bg-cover bg-center opacity-85 scale-[1.08] animate-ken-burns pointer-events-none" 
              />
              
              {/* Overlay shading to keep logo text clean */}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark/65 via-transparent to-black/35 pointer-events-none" />

              <div className="relative z-10 w-full h-full flex flex-col justify-between p-10 text-white select-none">
                <div>
                  <h3 className="font-display text-2xl font-bold mb-2 text-white">Dora Companion</h3>
                  <p className="font-body text-xs text-white/70 max-w-[280px] leading-relaxed">
                    "Lắng nghe, thấu hiểu và cùng bạn vượt qua những khoảnh khắc căng thẳng nhất."
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-ping" />
                  <span className="font-ui text-[10px] text-white/50 uppercase tracking-widest">Dora 001</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
