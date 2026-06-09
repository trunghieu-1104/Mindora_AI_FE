import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, LogOut, ChevronDown, User as UserIcon } from 'lucide-react'
import Button from '../atoms/Button'
import Avatar from '../atoms/Avatar'
import AuthModal from './AuthModal'
import { useAppStore } from '../../store/useAppStore'
import { cn } from '../../lib/utils'

const NAV_LINKS = [
  { to: '/chat',      label: 'Chat với Dora' },
  { to: '/journal',   label: 'Nhật ký' },
  { to: '/explore',   label: 'Khám phá' },
  { to: '/dashboard', label: 'Phân tích' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false) // Mobile menu
  const [dropdownOpen, setDropdownOpen] = useState(false) // User profile dropdown
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const { user, logout } = useAppStore()
  const location = useLocation()
  const dropdownRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Track scroll position to switch navbar style
  useEffect(() => {
    if (location.pathname !== '/') return
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  const openAuth = (mode) => {
    setAuthMode(mode)
    setIsAuthOpen(true)
    setOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setDropdownOpen(false)
    setOpen(false)
  }

  const userDisplayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Người dùng'

  const isHome = location.pathname === '/'
  // transparent only when at top of home page
  const isTransparent = isHome && !scrolled

  return (
    <nav className={cn(
      'top-0 z-50 transition-all duration-300',
      isHome
        ? cn('fixed w-full', scrolled ? 'bg-bg/95 backdrop-blur-md border-b border-primary/20 shadow-sm' : 'bg-transparent')
        : 'sticky bg-bg/80 backdrop-blur-md border-b border-primary/20'
    )}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <NavLink to="/" className={cn(
            'flex items-center gap-3 font-display text-xl font-semibold',
            isTransparent ? 'text-white' : 'text-text-main'
          )}>
            <img src="/LogoDora.png" alt="Mindora" className="h-[110px] w-[110px] object-contain" />
            Mindora
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => cn(
                  'px-4 py-2 rounded-full font-ui text-sm font-medium transition-all duration-200',
                  isTransparent
                    ? isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/15'
                    : isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-sub hover:text-text-main hover:bg-primary/20'
                )}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA / User Profile */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-primary/25 transition-all duration-200 cursor-pointer"
                >
                  <Avatar name={userDisplayName} size="sm" />
                  <span className="font-ui text-sm font-medium text-text-main max-w-[120px] truncate">
                    {userDisplayName}
                  </span>
                  <ChevronDown size={14} className={cn('text-text-sub transition-transform duration-200', dropdownOpen && 'rotate-180')} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-primary/20 rounded-2xl shadow-soft overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-primary/10 border-b border-primary/10">
                        <p className="font-ui text-xs text-text-sub">Đang đăng nhập bằng</p>
                        <p className="font-body text-xs font-semibold text-text-main truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-4 py-3 font-ui text-sm text-red-600 hover:bg-red-50 text-left transition-colors"
                      >
                        <LogOut size={16} />
                        Đăng xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuth('login')}
                  className={cn(
                    'px-5 py-2 rounded-full font-ui text-sm font-medium border transition-all duration-200',
                    isTransparent
                      ? 'border-white text-white hover:bg-white/15'
                      : 'border-text-sub text-text-sub hover:bg-primary/10 hover:border-primary hover:text-text-main'
                  )}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className={cn(
                    'px-5 py-2 rounded-full font-ui text-sm font-medium border transition-all duration-200',
                    isTransparent
                      ? 'border-white text-white hover:bg-white/15'
                      : 'bg-primary border-primary text-white hover:bg-primary/90'
                  )}
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-primary/20 transition-colors text-text-main"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-primary/20 bg-bg overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {/* User profile card inside mobile menu */}
              {user && (
                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-2xl mb-2">
                  <Avatar name={userDisplayName} size="md" />
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-text-main truncate">{userDisplayName}</p>
                    <p className="font-ui text-xs text-text-sub truncate">{user.email}</p>
                  </div>
                </div>
              )}

              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => cn(
                    'px-4 py-3 rounded-2xl font-ui text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text-sub hover:text-text-main hover:bg-primary/20'
                  )}
                >
                  {label}
                </NavLink>
              ))}

              <div className="mt-3 flex flex-col gap-2">
                {user ? (
                  <Button variant="danger" className="w-full justify-center py-3" onClick={handleLogout} icon={<LogOut size={16} />}>
                    Đăng xuất
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full justify-center" onClick={() => openAuth('login')}>
                      Đăng nhập
                    </Button>
                    <Button className="w-full justify-center" onClick={() => openAuth('signup')}>
                      Bắt đầu ngay
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultMode={authMode} />
    </nav>
  )
}
