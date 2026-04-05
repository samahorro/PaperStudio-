import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { Icon } from '@iconify/react'

function Navbar({currentUser, setCurrentUser}) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const isProducts = location.pathname === '/collections'


  const handleProfileClick = () => {
    navigate('/account')
  }
const hideNavbar = ['/login', '/register', '/forgot-password'].includes(location.pathname)
if (hideNavbar) return null

  return (
    <nav className={`navbar ${isHome ? 'navbar-home' : 'navbar-other'}`}>

      {/* only show empty left div on home for grid spacing */}
      {isHome && <div></div>}

      {/* CENTER on home, LEFT on other pages */}
      {isHome &&(
      <div className="navbar-center">
      <NavLink to="/" className="navbar-brand">
        <div className="brand-blob"></div>
        <span className="brand-name">PaperStudio</span>
      </NavLink>

       {/*collection links for home*/}
    
    <div className="collection-links">
        <NavLink to="/collections?category=pens" className="collection-link">Pens</NavLink>
        <NavLink to="/collections?category=pencils" className="collection-link">Pencils</NavLink>
        <NavLink to="/collections?category=notebooks" className="collection-link">Notebooks</NavLink>
        <NavLink to="/collections?category=sketchbooks" className="collection-link">Sketchbooks</NavLink>
        <NavLink to="/collections?category=calendars" className="collection-link">Calendars</NavLink>
        <NavLink to="/collections?category=cases" className="collection-link">Cases</NavLink>
    </div>
    </div>
    )}
    {!isHome && (
        <div className="navbar-other-left">
          <NavLink to="/" className="navbar-brand">
            <span className="brand-name brand-name-small">PaperStudio</span>
          </NavLink>
        </div>
      )}

        {isProducts && (
            <div className="collection-page">
                <NavLink to="/collections" className="collection-link">Collections</NavLink>
            </div>
        )}
        

      {/* RIGHT — icons always */}
      <div className="navbar-icons">
        <NavLink to="/search"> <Icon icon = "mingcute:search-2-fill" /> </NavLink>
        <NavLink to ="/cart"> <Icon icon = "mingcute:shopping-cart-2-fill" /> </NavLink>
        <NavLink to={currentUser?.role === 'admin' ? '/admin' : currentUser ? '/account' : '/login'}> <Icon icon = "fluent:person-28-filled" /> </NavLink>
      </div>

    </nav>
  )
}

export default Navbar