import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  return (
    <>
      {/* Navbar */}
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App