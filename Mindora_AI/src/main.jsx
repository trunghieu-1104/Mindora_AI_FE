import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAF6EC', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
          <h2 style={{ fontFamily: 'serif', color: '#16233D', marginBottom: '0.5rem' }}>Đã xảy ra lỗi</h2>
          <p style={{ color: '#6B7686', marginBottom: '1.5rem', maxWidth: '400px' }}>
            {this.state.error.message || 'Lỗi không xác định. Vui lòng kiểm tra file .env và thử lại.'}
          </p>
          <button onClick={() => window.location.reload()} style={{ padding: '0.75rem 2rem', background: '#C9A227', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontWeight: 600, color: '#FAF6EC' }}>
            Tải lại trang
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
