import { NavLink} from 'react-router-dom'
import './ProductCard.css'

function ProductCard({ product }) {

  return (
    <NavLink to={`/product/${product.id}`} className="product-card">
      <div className="product-image-wrap">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price}</p>
    </NavLink>
  )
}
  export default ProductCard