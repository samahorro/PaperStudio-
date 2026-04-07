import { useState, useEffect, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { getAllProducts } from '../utils/api'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import heroVideo from '../assets/images/hero-vid.mp4'
import "./HomePage.css"

function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [collectionIndex, setCollectionIndex] = useState(0)

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

  // Get the first product image for each collection to display in the collection card
  const collections = [
    { name: 'Wooden Collection', path: '/collections?collection=Wooden Collection' },
    { name: 'Zento Collection', path: '/collections?collection=Zento Collection' },
    { name: 'Kuru Toga Collection', path: '/collections?collection=Kuru Toga Collection' },
  ]

  const getCollectionImage = (collectionName) => {
    const product = products.find(p => p.collectionName === collectionName && p.imageUrl)
    return product ? product.imageUrl : null
  }

  const prevCollection = useCallback(() =>
    setCollectionIndex(i => (i - 1 + collections.length) % collections.length), [collections.length])

  const nextCollection = useCallback(() =>
    setCollectionIndex(i => (i + 1) % collections.length), [collections.length])

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
        <div className="collection-carousel">
          {(() => {
            const col = collections[collectionIndex]
            const img = getCollectionImage(col.name)
            return (
              <NavLink to={col.path} className="collection-card collection-card-large">
                {img
                  ? <img src={img} alt={col.name} className="collection-card-img" />
                  : <div className="collection-card-placeholder" />
                }
                <div className="collection-card-overlay">
                  <h3>{col.name}</h3>
                  <span className="collection-view-label">View Collection →</span>
                </div>
              </NavLink>
            )
          })()}
          <div className="collection-nav">
            <div className="collection-dots">
              {collections.map((_, i) => (
                <button
                  key={i}
                  className={`dot-btn${i === collectionIndex ? ' active' : ''}`}
                  onClick={() => setCollectionIndex(i)}
                  aria-label={`Go to collection ${i + 1}`}
                />
              ))}
            </div>
            <div className="collection-arrows">
              <button className="arrow-btn" onClick={prevCollection} aria-label="Previous collection">&#8592;</button>
              <button className="arrow-btn" onClick={nextCollection} aria-label="Next collection">&#8594;</button>
            </div>
          </div>
        </div>
      </section>

      {loading ? <LoadingSpinner /> : (
        <>
          {pens.length > 0 && (
            <section className="home-section">
              <h2>Pens</h2>
              <div className="product-row-scroll">
                <div className="product-row">
                  {pens.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {pencils.length > 0 && (
            <section className="home-section">
              <h2>Pencils</h2>
              <div className="product-row-scroll">
                <div className="product-row">
                  {pencils.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {cases.length > 0 && (
            <section className="home-section dark">
              <h2>Cases</h2>
              <div className="product-row-scroll">
                <div className="product-row">
                  {cases.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {notebooks.length > 0 && (
            <section className="home-section">
              <h2>Notebooks</h2>
              <div className="product-row-scroll">
                <div className="product-row">
                  {notebooks.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {sketchbooks.length > 0 && (
            <section className="home-section dark">
              <h2>Sketchbooks</h2>
              <div className="product-row-scroll">
                <div className="product-row">
                  {sketchbooks.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {calendars.length > 0 && (
            <section className="home-section">
              <h2>Calendars</h2>
              <div className="product-row-scroll">
                <div className="product-row">
                  {calendars.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

    </div>
  )
}

export default HomePage