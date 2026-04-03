import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, error, setError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    const result = await login(email, password)

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/account')
      }
    } else if (result.requiresMfa) {
      navigate('/mfa', { state: { email, password } })
    }
  }

  return (
    <div className="login-page">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="login-card">
        <NavLink to="/" className="login-brand">PaperStudio</NavLink>

        <div className="login-inner">
          <h2>Login</h2>
          <p className="login-sub">
            Don't have an account? <NavLink to="/register">Create one</NavLink>
          </p>

          {error && <p className="login-error">{error}</p>}

          <div className="login-field">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
            />
          </div>
        </div>

        <button
          className="login-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <NavLink to="/forgot-password" className="login-forgot">
          Forgot Password?
        </NavLink>
      </div>
    </div>
  )
}

export default LoginPage