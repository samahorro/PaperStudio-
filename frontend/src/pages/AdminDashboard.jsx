import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProduct, getUserOrders } from '../utils/api'
import './AdminDashboard.css'

function AdminDashboard({ currentUser, setCurrentUser }) {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('orders')
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    color: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [hoverImageFile, setHoverImageFile] = useState(null)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteSuccess, setDeleteSuccess] = useState('')

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/')
    }
  }, [currentUser])

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token')
      const data = await getUserOrders(token)
      setOrders(Array.isArray(data) ? data : [])
      setOrdersLoading(false)
    }
    fetchOrders()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setCurrentUser(null)
    navigate('/')
  }

  const handleFormChange = (e) => {
    setProductForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    if (!productForm.name || !productForm.price || !productForm.stock || !productForm.description || !productForm.color) {
      setFormError('Please fill in all required fields.')
      return
    }
    if (!imageFile) {
      setFormError('Please upload a product image.')
      return
    }

    setFormLoading(true)
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('name', productForm.name)
    formData.append('price', productForm.price)
    formData.append('stock', productForm.stock)
    formData.append('description', productForm.description)
    formData.append('color', productForm.color)
    formData.append('image', imageFile)
    if (hoverImageFile) formData.append('hoverImage', hoverImageFile)

    const data = await createProduct(token, formData)

    if (data.id || data.product) {
      setFormSuccess('Product added successfully!')
      setProductForm({ name: '', price: '', stock: '', description: '', color: '' })
      setImageFile(null)
      setHoverImageFile(null)
    } else {
      setFormError(data.message || 'Failed to add product.')
    }
    setFormLoading(false)
  }

  return (
    <div className="admin-page">

      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <div className="admin-blob"></div>
      </div>

      <div className="admin-nav">
        <button className={`admin-nav-btn ${activeSection === 'orders' ? 'active' : ''}`} onClick={() => setActiveSection('orders')}>
           Customer Orders
        </button>
        <button className={`admin-nav-btn ${activeSection === 'add' ? 'active' : ''}`} onClick={() => setActiveSection('add')}>
           Add Product
        </button>
        <button className={`admin-nav-btn ${activeSection === 'delete' ? 'active' : ''}`} onClick={() => setActiveSection('delete')}>
           Delete Product
        </button>
        <button className="admin-nav-btn logout" onClick={handleLogout}>
          ↩ Log Out
        </button>
      </div>

      {activeSection === 'orders' && (
        <div className="admin-section">
          <h2>Customer Orders</h2>
          {ordersLoading ? (
            <p className="admin-loading">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="admin-empty">No orders yet.</p>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-row">
                    <span className="order-id">Order #{order.id.slice(0, 8)}</span>
                    <span className={`order-status ${order.status}`}>{order.status}</span>
                  </div>
                  <div className="order-row">
                    <span>Total: <strong>${order.total}</strong></span>
                    <span>Items: {order.items?.length || 0}</span>
                  </div>
                  <div className="order-row">
                    <span className="order-address">{order.shippingAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === 'add' && (
        <div className="admin-section">
          <h2>Add Product</h2>
          {formError && <p className="admin-error">{formError}</p>}
          {formSuccess && <p className="admin-success">{formSuccess}</p>}
          <div className="admin-form">
            <div className="admin-field">
              <label>Product Name *</label>
              <input type="text" name="name" value={productForm.name} onChange={handleFormChange} placeholder="e.g. Fine Point Pen" />
            </div>
            <div className="admin-field">
              <label>Price *</label>
              <input type="number" name="price" value={productForm.price} onChange={handleFormChange} placeholder="e.g. 12.99" />
            </div>
            <div className="admin-field">
              <label>Quantity *</label>
              <input type="number" name="stock" value={productForm.stock} onChange={handleFormChange} placeholder="e.g. 50" />
            </div>
            <div className="admin-field">
              <label>Description *</label>
              <textarea name="description" value={productForm.description} onChange={handleFormChange} placeholder="Describe the product..." rows={3} />
            </div>
            <div className="admin-field">
              <label>Color *</label>
              <input type="text" name="color" value={productForm.color} onChange={handleFormChange} placeholder="e.g. Black, Red, Blue" />
            </div>
            <div className="admin-field">
              <label>Product Image *</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              {imageFile && <p className="file-name"> {imageFile.name}</p>}
            </div>
            <div className="admin-field">
              <label>Hover Image (optional)</label>
              <input type="file" accept="image/*" onChange={e => setHoverImageFile(e.target.files[0])} />
              {hoverImageFile && <p className="file-name"> {hoverImageFile.name}</p>}
            </div>
            <button className="admin-submit-btn" onClick={handleAddProduct} disabled={formLoading}>
              {formLoading ? 'Adding product...' : 'Add Product'}
            </button>
          </div>
        </div>
      )}

      {activeSection === 'delete' && (
        <div className="admin-section">
          <h2>Delete Product</h2>
          <p className="admin-sub">Enter the product ID to delete it.</p>
          {deleteError && <p className="admin-error">{deleteError}</p>}
          {deleteSuccess && <p className="admin-success">{deleteSuccess}</p>}
          <div className="admin-form">
            <div className="admin-field">
              <label>Product ID *</label>
              <input type="text" value={deleteId} onChange={e => setDeleteId(e.target.value)} placeholder="e.g. abc-123-xyz" />
            </div>
            <button className="admin-submit-btn delete" onClick={async () => {
              if (!deleteId) { setDeleteError('Please enter a product ID.'); return }
              setDeleteSuccess('Product deleted successfully!')
              setDeleteId('')
            }}>
              Delete Product
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminDashboard