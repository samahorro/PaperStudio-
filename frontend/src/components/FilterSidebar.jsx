import { useState } from 'react'
import './FilterSidebar.css'

function FilterSidebar({ filters, setFilters }) {
  const productTypes = ['Notebooks', 'Sketchbooks', 'Calendars', 'Pens', 'Pencils', 'Cases']
  const colors = ['Blue', 'Brown', 'Red', 'Green', 'Grey', 'Orange', 'Yellow', 'Purple', 'Pink', 'White', 'Black']
  const priceRanges = ['Under $10', '$10 - $20', '$20 - $50', 'Over $50']
  const collections = ['Wooden Collection', 'Zento Collection', 'Kuru Toga Collection']

  const [collapsed, setCollapsed] = useState({
    productType: false,
    collection: false,
    colors: false,
    availability: false,
    price: false
  })

  const toggleCollapse = (section) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleProductType = (type) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === type.toLowerCase() ? '' : type.toLowerCase()
    }))
  }

  const handleColor = (color) => {
    setFilters(prev => ({
      ...prev,
      color: prev.color === color.toLowerCase() ? '' : color.toLowerCase()
    }))
  }

  const handleAvailability = (value) => {
    setFilters(prev => ({
      ...prev,
      inStock: prev.inStock === value ? null : value
    }))
  }

  const handlePriceRange = (range) => {
    const priceMap = {
      'Under $10': { minPrice: 0,  maxPrice: 10 },
      '$10 - $20': { minPrice: 10, maxPrice: 20 },
      '$20 - $50': { minPrice: 20, maxPrice: 50 },
      'Over $50':  { minPrice: 50, maxPrice: null },
    }
    const selected = priceMap[range]
    if (filters.minPrice === selected.minPrice && filters.maxPrice === selected.maxPrice) {
      setFilters(prev => ({ ...prev, minPrice: null, maxPrice: null }))
    } else {
      setFilters(prev => ({ ...prev, ...selected }))
    }
  }

  return (
    <aside className="filter-sidebar">
      <h3 className="filter-title">filters</h3>

      {/* PRODUCT TYPE */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleCollapse('productType')}>
          <h4>Product Type</h4>
          <span className="filter-collapse">{collapsed.productType ? '+' : '—'}</span>
        </div>
        {!collapsed.productType && productTypes.map(type => (
          <label key={type} className="filter-option">
            <input
              type="checkbox"
              checked={filters.category === type.toLowerCase()}
              onChange={() => handleProductType(type)}
            />
            {type}
          </label>
        ))}
      </div>

      {/* COLLECTION */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleCollapse('collection')}>
          <h4>Collection</h4>
          <span className="filter-collapse">{collapsed.collection ? '+' : '—'}</span>
        </div>
        {!collapsed.collection && collections.map(col => (
          <label key={col} className="filter-option">
            <input
              type="checkbox"
              checked={filters.collectionName === col}
              onChange={() => setFilters(prev => ({
                ...prev,
                collectionName: prev.collectionName === col ? '' : col
              }))}
            />
            {col}
          </label>
        ))}
      </div>

      {/* COLORS */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleCollapse('colors')}>
          <h4>Colors</h4>
          <span className="filter-collapse">{collapsed.colors ? '+' : '—'}</span>
        </div>
        {!collapsed.colors && colors.map(color => (
          <label key={color} className="filter-option">
            <input
              type="checkbox"
              checked={filters.color === color.toLowerCase()}
              onChange={() => handleColor(color)}
            />
            {color}
          </label>
        ))}
      </div>

      {/* AVAILABILITY */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleCollapse('availability')}>
          <h4>Availability</h4>
          <span className="filter-collapse">{collapsed.availability ? '+' : '—'}</span>
        </div>
        {!collapsed.availability && (
          <>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.inStock === true}
                onChange={() => handleAvailability(true)}
              />
              In stock
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.inStock === false}
                onChange={() => handleAvailability(false)}
              />
              Out of stock
            </label>
          </>
        )}
      </div>

      {/* PRICE RANGE */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleCollapse('price')}>
          <h4>Price Range</h4>
          <span className="filter-collapse">{collapsed.price ? '+' : '—'}</span>
        </div>
        {!collapsed.price && priceRanges.map(range => (
          <label key={range} className="filter-option">
            <input
              type="checkbox"
              checked={
                filters.minPrice === ({ 'Under $10': 0, '$10 - $20': 10, '$20 - $50': 20, 'Over $50': 50 }[range]) &&
                filters.maxPrice === ({ 'Under $10': 10, '$10 - $20': 20, '$20 - $50': 50, 'Over $50': null }[range])
              }
              onChange={() => handlePriceRange(range)}
            />
            {range}
          </label>
        ))}
      </div>

    </aside>
  )
}

export default FilterSidebar