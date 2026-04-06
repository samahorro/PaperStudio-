import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, verifyRegistrationCode } from '../utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // restore user on page refresh
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email, password, mfaCode = null) => {
    setLoading(true)
    setError('')
    try {
      const data = await loginUser({ email, password, ...(mfaCode && { mfaCode }) })
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setCurrentUser(data.user)
        setLoading(false)
        return { success: true, user: data.user }
      } else if (data.requiresMfa) {
        setLoading(false)
        return { success: false, requiresMfa: true }
      } else {
        setError(data.message || 'Login failed.')
        setLoading(false)
        return { success: false, message: data.message }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return { success: false, message: 'Something went wrong.' }
    }
  }

  const register = async (firstName, lastName, email, password) => {
    setLoading(true)
    setError('')

    // password validation from guide
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return { success: false, message: 'Password must be at least 8 characters.' }
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.')
      setLoading(false)
      return { success: false, message: 'Password must contain at least one uppercase letter.' }
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number.')
      setLoading(false)
      return { success: false, message: 'Password must contain at least one number.' }
    }

    try {
      const data = await registerUser({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password
      })

      if (data.user) {
        // guide says mockEmailCode comes back for testing
        console.log('Verification code:', data.mockEmailCode)
        setLoading(false)
        return { success: true, email, mockEmailCode: data.mockEmailCode }
      } else if (data.errors) {
        const msg = data.errors.map(e => e.message).join(', ')
        setError(msg)
        setLoading(false)
        return { success: false, message: msg }
      } else {
        setError(data.message || 'Registration failed.')
        setLoading(false)
        return { success: false, message: data.message }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return { success: false, message: 'Something went wrong.' }
    }
  }

  const verify = async (email, code) => {
    setLoading(true)
    setError('')
    try {
      // guide says send { email, code } NOT { username, code }
      const data = await verifyRegistrationCode(email, code)
      if (data.message === 'Email verified successfully! You can now log in.') {
        setLoading(false)
        return { success: true }
      } else {
        setError(data.message || 'Invalid code.')
        setLoading(false)
        return { success: false, message: data.message }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return { success: false, message: 'Something went wrong.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      loading,
      error,
      setError,
      login,
      register,
      verify,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}