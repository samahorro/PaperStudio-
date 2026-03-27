import {NavLink} from 'react-router-dom';
import './Navbar.css';

function Navbar(){
        return(
            <nav className="navbar">

            {/* Left for grid spacing*/}
            <div></div>

            {/*Center - Logo n brand*/}
            <NavLink to="/" className="navbar-logo">
            <div className="brand-blob"></div>
            <span className="brand-name">Paper Studio</span>    
            </NavLink>

            {/*Right - icon Links*/}
            <div className="navbar-icons">
                <NavLink to="/search" className="icon-link">🔍</NavLink>
                <NavLink to="/cart" className="icon-link">🛒</NavLink>
                <NavLink to="/profile" className="icon-link">👤</NavLink>
            </div>
                
                </nav>
        )
    }
    export default Navbar;
