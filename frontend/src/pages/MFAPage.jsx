import { useState } from 'react'
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

function MFAPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error, setError } = useAuth()
  const { email, password } = location.state || {}
  const [code, setCode] = useState('')

  // If no state, redirect to login
  if (!email || !password) {
    navigate('/login')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!code) {
      setError('Please enter the verification code.')
      return
    }

    const result = await login(email, password, code)

    if (result.success) {
      if (email === 'admin@paperstudio.com') {
        navigate('/admin')
      } else {
        navigate('/account')
      }
    }
  }

  return (
    <div className="login-page">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="login-card">
        <NavLink to="/" className="login-brand">PaperStudio</NavLink>

        <div className="login-inner">
          <h2>Check your email</h2>
          <p className="login-sub">
            We sent a 6-digit code to <strong>{email}</strong>. Enter it below to sign in.
          </p>

          {error && <p className="login-error">{error}</p>}

          <div className="login-field">
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              autoFocus
              autoComplete="one-time-code"
            />
          </div>
        </div>

        <button
          className="login-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify & Sign In'}
        </button>

        <NavLink to="/login" className="login-forgot">
          ← Use a different account
        </NavLink>
      </div>
    </div>
  )
}

export default MFAPage
