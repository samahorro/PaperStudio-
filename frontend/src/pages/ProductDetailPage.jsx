import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../utils/api'
import { useCart } from '../context/CartContext'
import LoadingSpinner from '../components/LoadingSpinner'
import './ProductDetailPage.css'

function ProductDetailPage({ currentUser }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [cartMessage, setCartMessage] = useState('')
  const [cartLoading, setCartLoading] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id)
      setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    setCartLoading(true)
    const data = await addItem(product.id, quantity, product.color)
    if (data.item || data.message === 'Item added to cart') {
      setCartMessage(' Added to cart!')
    } else {
      setCartMessage(' Failed to add. Try again.')
    }
    setCartLoading(false)
  }

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const next = prev + change
      if (next < 1) return 1
      if (next > product.stock) return product.stock
      return next
    })
  }

  if (loading) return <LoadingSpinner />

  if (!product) return (
    <div className="product-detail-error">
      <p>Product not found.</p>
    </div>
  )

  return (
    <div className="product-detail-page">

      <div className="product-breadcrumb">
        <span onClick={() => navigate('/')}>Home</span>
        <span> › </span>
        <span onClick={() => navigate('/collections')}>Collections</span>
        <span> › </span>
        <span>{product.name}</span>
      </div>

      <div className="product-detail-content">

        <div className="product-detail-image-wrap">
          <img src={product.imageUrl} alt={product.name} className="product-detail-image" />
        </div>

        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-price">${product.price}</p>

          <p className={`product-detail-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {product.inStock ? `✓ In stock (${product.stock} available)` : '✗ Out of stock'}
          </p>

          <div className="product-detail-color">
            <span className="product-detail-label">Color</span>
            <span className="product-detail-color-tag">{product.color}</span>
          </div>

          {product.inStock && (
            <div className="product-detail-quantity">
              <span className="product-detail-label">Quantity</span>
              <div className="quantity-control">
                <button className="quantity-btn" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>—</button>
                <span className="quantity-value">{quantity}</span>
                <button className="quantity-btn" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>+</button>
              </div>
            </div>
          )}

          {product.inStock ? (
            <button className="product-detail-cart-btn" onClick={handleAddToCart} disabled={cartLoading}>
              {cartLoading ? 'Adding...' : 'Add to Cart'}
            </button>
          ) : (
            <button className="product-detail-cart-btn disabled" disabled>Out of Stock</button>
          )}

          {cartMessage && <p className="cart-message">{cartMessage}</p>}

          <div className="product-detail-description">
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage