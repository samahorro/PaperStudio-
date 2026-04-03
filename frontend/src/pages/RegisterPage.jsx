import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { registerUser, verifyRegistrationCode } from '../utils/api'
import './LoginPage.css'

function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('form') // 'form' or 'verify'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [verifyCode, setVerifyCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if(!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields.')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
    setError('Password must be at least 8 characters.')
    return
  }
  if (!/[A-Z]/.test(formData.password)) {
    setError('Password must contain at least one uppercase letter.')
    return
  }
  if (!/[0-9]/.test(formData.password)) {
    setError('Password must contain at least one number.')
    return
  }

  setLoading(true)

    const data = await registerUser(formData)

    if (data.user) {
      // registration successful — show verify step
      // in dev mode the code comes back in the response
      console.log('Verification code:', data.mockEmailCode)
      setStep('verify')
    } else {
      setError(data.message || 'Registration failed. Please try again.')
    }
    setLoading(false)
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const data = await verifyRegistrationCode(formData.email, verifyCode)

    if (data.message === 'Email verified successfully! You can now log in.') {
      navigate('/login')
    } else {
      setError(data.message || 'Invalid code. Please try again.')
    }
    setLoading(false)
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
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                />
              </div>
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
                Enter the 6-digit code sent to {formData.email}
              </p>

              {error && <p className="login-error">{error}</p>}

              <div className="login-field">
                <input
                  type="text"
                  value={verifyCode}
                  onChange={e => setVerifyCode(e.target.value)}
                  placeholder="6-digit code"
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
          </>
        )}
      </div>
    </div>
  )
}

export default RegisterPage