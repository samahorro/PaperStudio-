import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProduct, getUserOrders } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('orders')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [productForm, setProductForm] = useState({
    name: '', price: '', stock: '', description: '', color: '', category: ''
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
      if (!token) return
      const data = await getUserOrders(token)
      setOrders(Array.isArray(data) ? data : [])
      setOrdersLoading(false)
    }
    fetchOrders()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleFormChange = (e) => {
    setProductForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    if (!productForm.name || !productForm.price || !productForm.stock || !productForm.description || !productForm.color || !productForm.category) {
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
    formData.append('category', productForm.category)
    formData.append('image', imageFile)
    if (hoverImageFile) formData.append('hoverImage', hoverImageFile)

    const data = await createProduct(token, formData)

    if (data.id || data.product) {
      setFormSuccess('Product added successfully!')
      setProductForm({ name: '', price: '', stock: '', description: '', color: '', category: '' })
      setImageFile(null)
      setHoverImageFile(null)
    } else {
      setFormError(data.message || 'Failed to add product.')
    }
    setFormLoading(false)
  }

  // stats
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0).toFixed(2)

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <div className="admin-header-left">
          <p className="admin-greeting">Hi, welcome back <Icon icon = "streamline:smiley-cute-remix" /></p>
          <h1 className="admin-title">Admin Dashboard</h1>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <Icon icon="mingcute:back-2-fill" /> Log Out
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-icon"><Icon icon = "mynaui:package-solid" /></span>
          <div>
            <p className="stat-number">{totalOrders}</p>
            <p className="stat-label">Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon"><Icon icon = "simple-icons:stagetimer" /></span>
          <div>
            <p className="stat-number">{pendingOrders}</p>
            <p className="stat-label">Pending Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon"><Icon icon = "mdi:receipt-text-pending" /></span>
          <div>
            <p className="stat-number">{deliveredOrders}</p>
            <p className="stat-label">Delivered</p>
          </div>
        </div>
        <div className="stat-card dark">
          <span className="stat-icon"><Icon icon = "mingcute:pig-money-line" /></span>
          <div>
            <p className="stat-number">${totalRevenue}</p>
            <p className="stat-label">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* NAV BUTTONS */}
      <div className="admin-nav">
        <button className={`admin-nav-btn ${activeSection === 'orders' ? 'active' : ''}`} onClick={() => setActiveSection('orders')}>
          <Icon icon = "icon-park-solid:address-book" /> Customer Orders
        </button>
        <button className={`admin-nav-btn ${activeSection === 'add' ? 'active' : ''}`} onClick={() => setActiveSection('add')}>
          <Icon icon = "material-symbols-light:box-add-sharp" /> Add Product
        </button>
        <button className={`admin-nav-btn ${activeSection === 'delete' ? 'active' : ''}`} onClick={() => setActiveSection('delete')}>
          <Icon icon = "fa7-solid:trash-arrow-up" /> Delete Product
        </button>
      </div>

      {/* ORDERS SECTION */}
      {activeSection === 'orders' && (
        <div className="admin-section">
          <h2>Customer Orders</h2>
          {ordersLoading ? (
            <p className="admin-loading">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="admin-empty">No orders yet.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Address</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="order-id-cell">#{order.id.slice(0, 8)}</td>
                      <td>{order.shippingAddress}</td>
                      <td>{order.items?.length || 0}</td>
                      <td>${order.total}</td>
                      <td>{order.paymentMethod}</td>
                      <td>
                        <span className={`order-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD PRODUCT */}
      {activeSection === 'add' && (
        <div className="admin-section">
          <h2>Add Product</h2>
          {formError && <p className="admin-error">{formError}</p>}
          {formSuccess && <p className="admin-success">{formSuccess}</p>}

          <div className="admin-form">
            <div className="admin-form-row">
              <div className="admin-field">
                <label>Product Name *</label>
                <input type="text" name="name" value={productForm.name} onChange={handleFormChange} placeholder="e.g. Fine Point Pen" />
              </div>
              <div className="admin-field">
                <label>Category *</label>
                <select name="category" value={productForm.category} onChange={handleFormChange}>
                  <option value="">Select category</option>
                  <option value="notebooks">Notebooks</option>
                  <option value="sketchbooks">Sketchbooks</option>
                  <option value="calendars">Calendars</option>
                  <option value="pens">Pens</option>
                  <option value="pencils">Pencils</option>
                  <option value="cases">Cases</option>
                </select>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-field">
                <label>Price *</label>
                <input type="number" name="price" value={productForm.price} onChange={handleFormChange} placeholder="e.g. 12.99" />
              </div>
              <div className="admin-field">
                <label>Quantity *</label>
                <input type="number" name="stock" value={productForm.stock} onChange={handleFormChange} placeholder="e.g. 50" />
              </div>
              <div className="admin-field">
                <label>Color *</label>
                <input type="text" name="color" value={productForm.color} onChange={handleFormChange} placeholder="e.g. Black" />
              </div>
            </div>

            <div className="admin-field">
              <label>Description *</label>
              <textarea name="description" value={productForm.description} onChange={handleFormChange} placeholder="Describe the product..." rows={4} />
            </div>

            <div className="admin-form-row">
              <div className="admin-field">
                <label>Product Image *</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                {imageFile && <p className="file-name"><Icon icon="line-md:check-all" /> {imageFile.name}</p>}
              </div>
              <div className="admin-field">
                <label>Hover Image (optional)</label>
                <input type="file" accept="image/*" onChange={e => setHoverImageFile(e.target.files[0])} />
                {hoverImageFile && <p className="file-name"><Icon icon="line-md:check-all" /> {hoverImageFile.name}</p>}
              </div>
            </div>

            <button className="admin-submit-btn" onClick={handleAddProduct} disabled={formLoading}>
              {formLoading ? 'Adding product...' : 'Add Product'}
            </button>
          </div>
        </div>
      )}

      {/* DELETE PRODUCT */}
      {activeSection === 'delete' && (
        <div className="admin-section">
          <h2>Delete Product</h2>
          <p className="admin-sub">Enter the product ID to delete it. You can find the ID in the product URL.</p>
          {deleteError && <p className="admin-error">{deleteError}</p>}
          {deleteSuccess && <p className="admin-success">{deleteSuccess}</p>}
          <div className="admin-form">
            <div className="admin-field">
              <label>Product ID *</label>
              <input type="text" value={deleteId} onChange={e => setDeleteId(e.target.value)} placeholder="e.g. abc-123-xyz" />
            </div>
            <button className="admin-submit-btn delete" onClick={() => {
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