import { NavLink} from 'react-router-dom'
import './ProductCard.css'

function ProductCard({ product }) {

  return (
    <NavLink to={`/products/${product.id}`} className="product-card">
      <div className="product-image-wrap">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        </div>
        <p className="product-name">{product.name}</p>
        <p className="product-price">${product.price}</p>
    </NavLink>
  )
}
  export default ProductCard