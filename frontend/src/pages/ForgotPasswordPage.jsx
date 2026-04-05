import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { forgotPassword, resetPassword } from '../utils/api'
import './LoginPage.css'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // 'email' or 'reset'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSendCode = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) { setError('Please enter your email.'); return }

    setLoading(true)
    const data = await forgotPassword(email)
    // guide says mockResetCode comes back in response for testing
    console.log('Reset code (dev only):', data.mockResetCode)
    setSuccess('Reset code sent! Check your email. (Dev: check console)')
    setStep('reset')
    setLoading(false)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (!code || !newPassword) { setError('Please fill in all fields.'); return }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (!/[A-Z]/.test(newPassword)) { setError('Password must contain at least one uppercase letter.'); return }
    if (!/[0-9]/.test(newPassword)) { setError('Password must contain at least one number.'); return }

    setLoading(true)
    const data = await resetPassword(email, code, newPassword)

    if (data.message === 'Password reset successfully. You can now log in with your new password.') {
      navigate('/login')
    } else {
      setError(data.message || 'Failed to reset password.')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="login-card">
        <NavLink to="/" className="login-brand">PaperStudio</NavLink>

        {step === 'email' ? (
          <>
            <div className="login-inner">
              <h2>Forgot Password</h2>
              <p className="login-sub">Enter your email and we'll send you a reset code.</p>
              {error && <p className="login-error">{error}</p>}
              {success && <p style={{color: '#0f6e56', fontSize: '0.8rem'}}>{success}</p>}
              <div className="login-field">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </div>
            </div>
            <button className="login-btn" onClick={handleSendCode} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
            <NavLink to="/login" className="login-forgot">← Back to login</NavLink>
          </>
        ) : (
          <>
            <div className="login-inner">
              <h2>Reset Password</h2>
              <p className="login-sub">Enter the code sent to {email} and your new password.</p>
              {error && <p className="login-error">{error}</p>}
              <div className="login-field">
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="6-digit reset code"
                  maxLength={6}
                />
              </div>
              <div className="login-field">
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="New password"
                  autoComplete="new-password"
                />
              </div>
              <p className="login-sub">Min 8 chars, 1 uppercase, 1 number</p>
            </div>
            <button className="login-btn" onClick={handleResetPassword} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <p className="login-forgot" style={{cursor:'pointer'}} onClick={() => setStep('email')}>
              ← Back
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage