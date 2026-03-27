import { NavLink } from 'react-router-dom'
import "./HomePage.css"

function HomePage() {
  return (
    <div className="homepage">

      {/* HERO */}
      <section className="home-hero">
        <div className="hero-content">
          <h1>Stationery that inspires creativity</h1>
          <p>Discover, Organize, Create, with our curated collection of stationery.</p>
          <NavLink to="/collections">
            <button className="shop-now-btn">Shop Now</button>
          </NavLink>
        </div>
      </section>

    </div>
  )
}

export default HomePage