import { Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import AccountPage from './pages/AccountPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AdminPage from './pages/AdminDashboard'
import ContactPage from './pages/ContactPage'

{/*using auth to manage user state*/}
function AppContent() {
  const { currentUser, setCurrentUser } = useAuth()


  return (
    <CartProvider>
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collections" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage currentUser={currentUser} />} />
        <Route path="/cart" element={<CartPage currentUser={currentUser} />} />
        <Route path="/account" element={<AccountPage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </CartProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App