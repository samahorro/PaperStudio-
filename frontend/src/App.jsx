import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import Footer from './components/Footer'
import ProductsPage from './pages/ProductsPage'
import AccountPage from './pages/AccountPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import { CartProvider } from './context/CartContext'
import CartPage from './pages/CartPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AdminPage from './pages/AdminDashboard'
import ContactPage from './pages/ContactPage'


function App() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  return (
    <CartProvider>
    
      {/* Navbar */}
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />

      {/* Routes */}
      <Routes>
        <Route path="/account" element={<AccountPage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
        <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
        <Route path="/register" element={<RegisterPage />} />
                <Route path="/products/:id" element={<ProductDetailPage currentUser={currentUser} />} />
        <Route path="/" element={<HomePage />} />
         <Route path="/cart" element={<CartPage currentUser={currentUser} />} />
      <Route path="/admin" element={<AdminPage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
        <Route path="/collections" element={<ProductsPage />} />
        <Route path="/contact" element={<ContactPage />} />

      </Routes>
    
      <Footer />
    </CartProvider>
    
  )
}

export default App