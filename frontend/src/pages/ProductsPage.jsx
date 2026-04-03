import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllProducts } from '../utils/api'
import FilterSidebar from '../components/FilterSidebar'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import './ProductsPage.css'

function ProductsPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    color: '',
    inStock: null,
    minPrice: null,
    maxPrice: null
  })

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const data = await getAllProducts()
      setProducts(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    if (filters.category && product.category !== filters.category) return false
    if (filters.color && product.color.toLowerCase() !== filters.color) return false
    if (filters.inStock !== null && product.inStock !== filters.inStock) return false
    if (filters.minPrice !== null && parseFloat(product.price) < filters.minPrice) return false
    if (filters.maxPrice !== null && parseFloat(product.price) > filters.maxPrice) return false
    return true
  })

  return (
    <div className="products-page">

      {/* HEADER */}
   

      {/* CONTENT */}
      <div className="products-content">

        {/* FILTER SIDEBAR */}
        <FilterSidebar filters={filters} setFilters={setFilters} />

        {/* PRODUCT GRID */}
        <div className="products-grid-wrap">
          {loading ? (
            <LoadingSpinner />
          ) : filteredProducts.length === 0 ? (
            <p className="products-empty">No products found.</p>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProductsPage