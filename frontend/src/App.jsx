import React, { useState } from 'react'
import { createProduct } from './utils/api'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [currentUser, setCurrentUser] = useState(null)
  const [registeredUsers, setRegisteredUsers] = useState([])

  const [registerUsername, setRegisterUsername] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [formMessage, setFormMessage] = useState('')

  // Admin New Product State
  const [adminProductName, setAdminProductName] = useState('')
  const [adminProductDesc, setAdminProductDesc] = useState('')
  const [adminProductPrice, setAdminProductPrice] = useState('')
  const [adminProductImage, setAdminProductImage] = useState(null)
  const [adminMessage, setAdminMessage] = useState('')

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

  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    setAdminMessage('Uploading to S3...')
    
    // We MUST use FormData to send a file to the backend
    const formData = new FormData()
    formData.append('name', adminProductName)
    formData.append('description', adminProductDesc)
    formData.append('price', adminProductPrice)
    if (adminProductImage) {
      formData.append('image', adminProductImage) // 'image' matches the backend multer field name
    }

    try {
      const result = await createProduct('mock-token-here', formData)
      if (result.product) {
        setAdminMessage(`Success! Product created with S3 Image URL: ${result.product.imageUrl}`)
        setAdminProductName('')
        setAdminProductDesc('')
        setAdminProductPrice('')
        setAdminProductImage(null)
      } else {
        setAdminMessage(`Error: ${result.message || 'Failed to upload'}`)
      }
    } catch (err) {
      setAdminMessage(`Network/Server Error: ${err.message}`)
    }
  }

  return (
    <div style={{ backgroundColor: 'white', color: 'black', fontFamily: 'serif' }}>
      <div>
        <a href="#" onClick={(e) => { e.preventDefault(); setFormMessage(''); setCurrentPage('home') }}>Home</a> | 
        <a href="#" onClick={(e) => { e.preventDefault(); setFormMessage(''); setCurrentPage('products') }}>Products</a> | 
        <a href="#" onClick={(e) => { e.preventDefault(); setFormMessage(''); setCurrentPage('admin') }}>Admin (Upload Image)</a> | 
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

      {currentPage === 'admin' && (
        <div>
          <h1>Admin: Create Product with Image Upload</h1>
          <form onSubmit={handleAdminSubmit}>
            <div>
              <label>Product Name: </label>
              <input type="text" value={adminProductName} onChange={e => setAdminProductName(e.target.value)} required />
            </div>
            <div>
              <label>Description: </label>
              <textarea value={adminProductDesc} onChange={e => setAdminProductDesc(e.target.value)} />
            </div>
            <div>
              <label>Price ($): </label>
              <input type="number" step="0.01" value={adminProductPrice} onChange={e => setAdminProductPrice(e.target.value)} required />
            </div>
            <div>
              <label>Photo (S3 Upload): </label>
              <input type="file" accept="image/*" onChange={e => setAdminProductImage(e.target.files[0])} required />
            </div>
            <button type="submit">Upload and Create Product</button>
          </form>
          {adminMessage && <p style={{ color: 'blue' }}>{adminMessage}</p>}
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
