import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

function RegisterPage() {
  const navigate = useNavigate()
  const { register, verify, loading, error, setError } = useAuth()
  const [step, setStep] = useState('form')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields.')
      return
    }

    const result = await register(firstName, lastName, email, password)
    if (result.success) {
      setStep('verify')
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')

    if (!code) {
      setError('Please enter the verification code.')
      return
    }

    const result = await verify(email, code)
    if (result.success) {
      navigate('/login')
    }
  }

  return (
    <div className="login-page">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="login-card">
        <NavLink to="/" className="login-brand">PaperStudio</NavLink>

        {step === 'form' ? (
          <>
            <div className="login-inner">
              <h2>Create Account</h2>
              <p className="login-sub">
                Already have an account? <NavLink to="/login">Log in</NavLink>
              </p>

              {error && <p className="login-error">{error}</p>}

              <div className="login-field">
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                />
              </div>
              <div className="login-field">
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
                />
              </div>
              <div className="login-field">
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Username"
                  autoComplete="username"
                />
              </div>
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
                  autoComplete="new-password"
                />
              </div>
              <p className="login-sub">Min 8 chars, 1 uppercase, 1 number</p>
            </div>

            <button
              className="login-btn"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </>
        ) : (
          <>
            <div className="login-inner">
              <h2>Verify your email</h2>
              <p className="login-sub">
                Check your email for a 6-digit code sent to {email}.
                During testing check your browser console!
              </p>

              {error && <p className="login-error">{error}</p>}

              <div className="login-field">
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>
            </div>

            <button
              className="login-btn"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <p
              className="login-forgot"
              style={{ cursor: 'pointer' }}
              onClick={() => setStep('form')}
            >
              ← Back
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default RegisterPage