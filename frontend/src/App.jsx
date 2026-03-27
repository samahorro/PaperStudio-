import React, { useState } from 'react'
import { createProduct } from './utils/api'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  return (
    <div style={{ backgroundColor: 'white', color: 'black', fontFamily: 'serif' }}>
      
      {/* Navbar always visible */}
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* You can expand later like this */}
        {/* <Route path="/products" element={<ProductsPage />} /> */}
        {/* <Route path="/admin" element={<AdminPage />} /> */}
      </Routes>

    </div>
  )
}

export default App