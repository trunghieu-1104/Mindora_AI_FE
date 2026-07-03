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
            className="bg-organic-pattern rounded-4xl shadow-soft w-full max-w-md overflow-hidden relative border border-primary/20 p-6 md:p-8"
          >
            {/* Blurred brand overlay for readability */}
            <div className="absolute inset-0 bg-[#FCFAF5]/90 backdrop-blur-[2px] pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 p-2 rounded-xl hover:bg-primary/20 text-text-sub transition-colors cursor-pointer z-10"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="text-center mb-6 mt-2 relative z-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl mx-auto mb-3 shadow-md">
                🌸
              </div>
              <h2 className="font-display text-2xl font-bold text-text-main flex items-center justify-center gap-2">
                {mode === 'login' ? 'Chào mừng trở lại' : 'Bắt đầu hành trình'}
                <Sparkles size={18} className="text-primary-dark animate-pulse" />
              </h2>
              <p className="font-body text-xs text-text-sub mt-1">
                {mode === 'login'
                  ? 'Hãy đăng nhập để đồng hành cùng Dora và lưu lại hành trình cảm xúc'
                  : 'Hãy tạo tài khoản để đồng hành cùng Dora ngay hôm nay'}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2 text-red-700 text-xs font-medium relative z-10"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p className="leading-relaxed">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
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
                    className="input-field pl-12 bg-white"
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
                  className="input-field pl-12 bg-white"
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
                  className="input-field pl-12 bg-white"
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full justify-center mt-2 py-3 rounded-full text-base font-semibold cursor-pointer"
              >
                {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
              </Button>
            </form>

            {/* Toggle Mode Footer */}
            <div className="text-center mt-6 pt-4 border-t border-primary/20 relative z-10">
              <p className="font-ui text-xs text-text-sub">
                {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản rồi?'}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login')
                    setError(null)
                  }}
                  className="text-primary-dark font-semibold hover:underline ml-1 cursor-pointer"
                >
                  {mode === 'login' ? 'Tạo tài khoản ngay' : 'Đăng nhập tại đây'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
