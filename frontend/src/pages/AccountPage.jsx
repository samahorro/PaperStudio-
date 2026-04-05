import { useState, useEffect } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserOrders } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import './AccountPage.css'
import {Icon} from '@iconify/react'

function AccountPage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [activeSection, setActiveSection] = useState(null)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

useEffect(() => {
  if (!currentUser) {
    navigate('/login')
  }
}, [currentUser])

if (!currentUser) return null

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleOrderHistory = async () => {
    setActiveSection('orders')
    setOrdersLoading(true)
    const token = localStorage.getItem('token')
    const data = await getUserOrders(token)
    setOrders(Array.isArray(data) ? data : [])
    setOrdersLoading(false)
  }

  return (
    <div className="account-page">

      {/* PROFILE CARD */}
      <div className="profile-card">
        <h2 className="profile-title">Profile</h2>
        <div className="profile-avatar">
          <div className="avatar-circle">
            <div className="avatar-head"></div>
            <div className="avatar-body"></div>
          </div>
        </div>
        <h3 className="profile-name">{currentUser.name}</h3>
        <p className="profile-email">email: {currentUser.email}</p>
      </div>

      {/* ACCOUNT MENU */}
      <div className="account-menu-wrap">
        <div className="account-card">
          <span className="account-tag">Your Account</span>

          <button className="account-item" onClick={handleOrderHistory}>
            <Icon icon ="icon-park-solid:transaction-order" />
            Order History
          </button>
          <button className="account-item" onClick={() => setActiveSection('settings')}>
            <Icon icon="icon-park-solid:setting-two" />
            Settings
          </button>
          
         
          <NavLink to="/contact" className="account-item">
            <Icon icon="icon-park-solid:mail" />
            Need help? Contact us
          </NavLink>
          <button className="account-logout" onClick={handleLogout}>
            <Icon icon="icon-park-solid:back" />
            Log out
          </button>
        </div>
      </div>

      {/* ORDER HISTORY SECTION */}
      {activeSection === 'orders' && (
        <div className="account-section">
          <h3>Order History</h3>
          {ordersLoading ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <p className="account-empty">No orders yet.</p>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-row">
                    <span className="order-id">#{order.id.slice(0, 8)}</span>
                    <span className={`order-badge ${order.status}`}>{order.status}</span>
                  </div>
                  <div className="order-row">
                    <span>Total: <strong>${order.total}</strong></span>
                    <span>{order.items?.length || 0} items</span>
                  </div>
                  <div className="order-row">
                    <span className="order-address">{order.shippingAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SETTINGS SECTION */}
      {activeSection === 'settings' && (
        <div className="account-section">
          <h3>Settings</h3>
          <div className="settings-options">
            <NavLink to="/forgot-password" className="settings-item">
              <Icon icon="icon-park-solid:key-one" />
              Forgot Password
            </NavLink>
            <NavLink to="/change-password" className="settings-item">
              <Icon icon="icon-park-solid:electronic-locks-close" />
              Change Password
            </NavLink>
          </div>
        </div>
      )}

    </div>
  )
}

export default AccountPage