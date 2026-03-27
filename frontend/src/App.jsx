import React, { useState } from 'react'
import { createProduct } from './utils/api'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  return (
    <div style={{ backgroundColor: 'white', color: 'black', fontFamily: 'serif' }}>

      {/* Navbar /}
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />

      {/ Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>

    </div>
  )
}

export default App