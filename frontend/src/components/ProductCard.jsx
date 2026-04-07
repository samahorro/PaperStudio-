import { NavLink} from 'react-router-dom'
import './ProductCard.css'

function ProductCard({ product }) {
  return (
    <NavLink to={`/products/${product.id}`} className="product-card">
      <div className="card-image-container">
        {product.isNewArrival && (
          <div className="badge new-arrival">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="star-icon">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            New arrival
          </div>
        )}
        
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={product.name} 
          className="product-image primary-img" 
        />
        
        {product.hoverImageUrl && (
          <img 
            src={product.hoverImageUrl} 
            alt={`${product.name} Hover`} 
            className="product-image secondary-img" 
          />
        )}
      </div>

      <div className="card-details">
        <h3 className="product-title">{product.name}</h3>
        
        {product.colorsCount && (
           <p className="product-colors">{product.colorsCount} colors available</p>
        )}
        
        <div className="stock-status">
          <span className={`status-dot ${product.inStock ? 'in-stock' : 'out-of-stock'}`}></span>
          <span className="status-text">{product.inStock ? 'In stock' : 'Out of stock'}</span>
        </div>
        
        <p className="product-price">${parseFloat(product.price || 0).toFixed(2)}</p>
      </div>
    </NavLink>
  )
}
  export default ProductCard