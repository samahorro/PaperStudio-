import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { getAllProducts } from '../utils/api'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import heroVideo from '../assets/images/hero-vid.mp4'
import "./HomePage.css"

function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts()
      setProducts(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  // split by all 6 categories
  const pens = products.filter(p => p.category === 'pens')
  const pencils = products.filter(p => p.category === 'pencils')
  const notebooks = products.filter(p => p.category === 'notebooks')
  const sketchbooks = products.filter(p => p.category === 'sketchbooks')
  const calendars = products.filter(p => p.category === 'calendars')
  const cases = products.filter(p => p.category === 'cases')

  return (
    <div className="homepage">

      {/* HERO VIDEO */}
      <section className="home-hero">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="hero-content">
          <h1>Stationery that inspires creativity</h1>
          <p>Discover, Organize, Create, with our curated collection of stationery.</p>
          <NavLink to="/collections">
            <button className="shop-now-btn">Shop Now</button>
          </NavLink>
        </div>
      </section>

      {/* COLLECTION BANNER */}
      <section className="home-collection">
        <h2>Collection</h2>
        <div className="collection-grid">
          <NavLink to="/collections?category=notebooks" className="collection-card" />
          <NavLink to="/collections?category=pencils" className="collection-card" />
          <NavLink to="/collections?category=cases" className="collection-card" />
        </div>
      </section>

      {loading ? <LoadingSpinner /> : (
        <>
          {pens.length > 0 && (
            <section className="home-section">
              <h2>Pens</h2>
              <div className="product-row">
                {pens.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {pencils.length > 0 && (
            <section className="home-section">
              <h2>Pencils</h2>
              <div className="product-row">
                {pencils.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {cases.length > 0 && (
            <section className="home-section dark">
              <h2>Cases</h2>
              <div className="product-row">
                {cases.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {notebooks.length > 0 && (
            <section className="home-section">
              <h2>Notebooks</h2>
              <div className="product-row">
                {notebooks.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {sketchbooks.length > 0 && (
            <section className="home-section dark">
              <h2>Sketchbooks</h2>
              <div className="product-row">
                {sketchbooks.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {calendars.length > 0 && (
            <section className="home-section">
              <h2>Calendars</h2>
              <div className="product-row">
                {calendars.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

    </div>
  )
}

export default HomePage