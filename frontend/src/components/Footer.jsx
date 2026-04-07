import { NavLink } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
     <footer className="footer">
      <div className="footer-left">
        <div className="footer-logo">
            <h2>PaperStudio</h2>
        </div>
      </div>

  <div className="footer-icons">
    <h4>Important Link</h4>
    <NavLink to="/about">About Us</NavLink>
    <NavLink to="/contact">Contact Us</NavLink>
  </div>


  <div className="footer-bottom">
    <p>© 2026 All Right Reserved</p>
  </div>
</footer>
    )
}

export default Footer