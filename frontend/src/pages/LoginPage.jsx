import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { loginUser } from '../utils/api'
import './LoginPage.css'

function LoginPage({ setCurrentUser }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if(!formData.email || !formData.password) {
      setError('Please fill in all fields.')
      return
    }

  setLoading(true)

    const data = await loginUser(formData)

    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setCurrentUser(data.user)
      if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/account')
      }
    } else if (data.requiresMfa) {
      navigate('/mfa', { state: { email: formData.email, password: formData.password } })
    } else {
      setError(data.message || 'Login failed. Please try again.')
    }
    setLoading(false)
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>

          <div className="login-field">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
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