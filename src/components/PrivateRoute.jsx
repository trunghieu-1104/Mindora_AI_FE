import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import AuthModal from './organisms/AuthModal'

export default function PrivateRoute({ children }) {
  const user = useAppStore((s) => s.user)
  const [dismissed, setDismissed] = useState(false)

  if (user) return children

  if (dismissed) return <Navigate to="/" replace />

  return <AuthModal isOpen onClose={() => setDismissed(true)} />
}
