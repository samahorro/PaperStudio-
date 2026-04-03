import { useNavigate, NavLink } from 'react-router-dom'
import './AccountPage.css'

function AccountPage({ currentUser, setCurrentUser }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setCurrentUser(null)
    navigate('/')
  }

  // if not logged in, redirect to login
  if (!currentUser) {
    navigate('/login')
    return null
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

          <NavLink to="/orders" className="account-item">
            <span className="account-icon">📋</span>
            Order History
          </NavLink>
          <NavLink to="/settings" className="account-item">
            <span className="account-icon">⚙️</span>
            Settings
          </NavLink>
          <NavLink to="/payment" className="account-item">
            <span className="account-icon">💳</span>
            Payment
          </NavLink>
          <NavLink to="/contact" className="account-item">
            <span className="account-icon">💬</span>
            Need help? Contact us
          </NavLink>

          <button className="account-logout" onClick={handleLogout}>
            <span className="account-icon">↩️</span>
            Log out
          </button>
        </div>
      </div>

    </div>
  )
}

export default AccountPage