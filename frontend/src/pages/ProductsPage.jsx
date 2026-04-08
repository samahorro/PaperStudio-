import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { getAllProducts } from '../utils/api'
import FilterSidebar from '../components/FilterSidebar'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Icon } from '@iconify/react'
import './ProductsPage.css'

function ProductsPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)
  const location = useLocation()
  const isSearchPage = location.pathname === '/search' || searchParams.get('search') === 'true'
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    collectionName: searchParams.get('collection') || '',
    color: '',
    inStock: null,
    minPrice: null,
    maxPrice: null
  })

  // Auto-focus the search input when arriving from the search icon
  useEffect(() => {
    if (isSearchPage && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchPage])

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
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const nameMatch = product.name?.toLowerCase().includes(q)
      const descMatch = product.description?.toLowerCase().includes(q)
      if (!nameMatch && !descMatch) return false
    }
    if (filters.category && product.category !== filters.category) return false
    if (filters.collectionName && product.collectionName !== filters.collectionName) return false
    if (filters.color && product.color.toLowerCase() !== filters.color) return false
    if (filters.inStock !== null && product.inStock !== filters.inStock) return false
    if (filters.minPrice !== null && parseFloat(product.price) < filters.minPrice) return false
    if (filters.maxPrice !== null && parseFloat(product.price) > filters.maxPrice) return false
    return true
  })

  return (
    <div className="products-page">

      {/* SEARCH BAR */}
      <div className="products-search-bar">
        <Icon icon="wpf:search" className="search-bar-icon" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar-input"
        />
        {searchQuery && (
          <button className="search-bar-clear" onClick={() => setSearchQuery('')}>
            &times;
          </button>
        )}
      </div>

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