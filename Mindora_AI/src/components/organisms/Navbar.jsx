import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Button from '../atoms/Button'
import { cn } from '../../lib/utils'

const NAV_LINKS = [
  { to: '/',          label: 'Trang chủ' },
  { to: '/chat',      label: 'Chat' },
  { to: '/journal',   label: 'Nhật ký' },
  { to: '/explore',   label: 'Khám phá' },
  { to: '/dashboard', label: 'Phân tích' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-primary/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 font-display text-xl font-semibold text-text-main">
            <img src="/LogoDora.png" alt="Mindora" className="h-[88px] w-[88px] object-contain" />
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
                  isActive
                    ? 'bg-primary text-text-main'
                    : 'text-text-sub hover:text-text-main hover:bg-primary/20'
                )}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-sm py-2">Đăng nhập</Button>
            <Button size="sm" className="text-sm py-2">Bắt đầu ngay</Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-primary/20 transition-colors"
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
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => cn(
                    'px-4 py-3 rounded-2xl font-ui text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-text-main'
                      : 'text-text-sub hover:text-text-main hover:bg-primary/20'
                  )}
                >
                  {label}
                </NavLink>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <Button variant="ghost" className="w-full justify-center">Đăng nhập</Button>
                <Button className="w-full justify-center">Bắt đầu ngay</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
