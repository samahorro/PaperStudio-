import React, { useState } from 'react'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [currentUser, setCurrentUser] = useState(null)
  const [registeredUsers, setRegisteredUsers] = useState([])

  const [registerUsername, setRegisterUsername] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [formMessage, setFormMessage] = useState('')

  const handleRegister = (e) => {
    e.preventDefault()
    setRegisteredUsers([...registeredUsers, { username: registerUsername, password: registerPassword }])
    setFormMessage('Registration successful! You can now login.')
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const found = registeredUsers.find(x => x.username === loginUsername && x.password === loginPassword)
    if (found) {
      setCurrentUser(found.username)
      setCurrentPage('home')
    } else {
      setFormMessage('Invalid username or password')
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  return (
    <div style={{ backgroundColor: 'white', color: 'black', fontFamily: 'serif' }}>
      <div>
        <a href="#" onClick={(e) => { e.preventDefault(); setFormMessage(''); setCurrentPage('home') }}>Home</a> | 
        <a href="#" onClick={(e) => { e.preventDefault(); setFormMessage(''); setCurrentPage('products') }}>Products</a> | 
        {!currentUser && <a href="#" onClick={(e) => { e.preventDefault(); setFormMessage(''); setCurrentPage('login') }}>Login</a>}
        {!currentUser && <span> | </span>}
        {!currentUser && <a href="#" onClick={(e) => { e.preventDefault(); setFormMessage(''); setCurrentPage('register') }}>Register</a>}
        {currentUser && <a href="#" onClick={(e) => { e.preventDefault(); handleLogout() }}>Logout ({currentUser})</a>}
      </div>
      <hr />
      
      {currentPage === 'home' && (
        <div>
          <h1>Homepage</h1>
        </div>
      )}

      {currentPage === 'products' && (
        <div>
          <h1>Available Items</h1>
          <ul>
            <li>Used Couch - $10</li>
            <li>Bicycle - $20</li>
          </ul>
        </div>
      )}

      {currentPage === 'register' && (
        <div>
          <h1>Create an Account</h1>
          <form onSubmit={handleRegister}>
            <div>
              <label>Username: </label>
              <input type="text" value={registerUsername} onChange={e => setRegisterUsername(e.target.value)} />
            </div>
            <div>
              <label>Password: </label>
              <input type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} />
            </div>
            <button type="submit">Sign Up</button>
          </form>
          {formMessage && <p>{formMessage}</p>}
        </div>
      )}

      {currentPage === 'login' && (
        <div>
          <h1>Sign In</h1>
          <form onSubmit={handleLogin}>
            <div>
              <label>Username: </label>
              <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} />
            </div>
            <div>
              <label>Password: </label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
          </form>
          {formMessage && <p>{formMessage}</p>}
        </div>
      )}
    </div>
  )
}

export default App
