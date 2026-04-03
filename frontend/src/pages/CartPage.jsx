import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateCoupon } from '../utils/api'
import { useCart } from '../context/CartContext'
import LoadingSpinner from '../components/LoadingSpinner'
import './CartPage.css'

function CartPage({ currentUser }) {
  const navigate = useNavigate()
  const { cart, cartLoading, updateItem, removeItem } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [discount, setDiscount] = useState(null)

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
    }
  }, [currentUser])

  const handleQuantityChange = async (cartItemId, change, currentQty) => {
    const newQty = currentQty + change
    if (newQty < 1) {
      await removeItem(cartItemId)
      return
    }
    await updateItem(cartItemId, newQty)
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    setCouponLoading(true)
    setCouponMessage('')
    const token = localStorage.getItem('token')
    const data = await validateCoupon(token, couponCode)

    if (data.coupon) {
      setDiscount(data.coupon)
      setCouponMessage(` Coupon applied! ${data.coupon.discountType === 'percent'
        ? `${data.coupon.discountValue}% off`
        : `$${data.coupon.discountValue} off`}`)
    } else {
      setCouponMessage(` ${data.message || 'Invalid coupon code.'}`)
      setDiscount(null)
    }
    setCouponLoading(false)
  }

  const calculateDiscount = (subtotal) => {
    if (!discount) return 0
    if (discount.discountType === 'percent') {
      return (subtotal * parseFloat(discount.discountValue) / 100).toFixed(2)
    }
    return parseFloat(discount.discountValue).toFixed(2)
  }

  if (cartLoading) return <LoadingSpinner />

  const subtotal = cart?.subtotal || 0
  const discountAmount = calculateDiscount(subtotal)
  // guide says free shipping over $50, otherwise $5.99
  const shipping = subtotal >= 50 ? 0 : 5.99
  // guide says tax is 8% of post-discount subtotal
  const tax = ((subtotal - discountAmount) * 0.08).toFixed(2)
  const total = (parseFloat(subtotal) - parseFloat(discountAmount) + shipping + parseFloat(tax)).toFixed(2)

  return (
    <div className="cart-page">

      <div className="cart-main">
        <h1 className="cart-title">My Cart</h1>

        {cart?.items?.length > 0 && (
          <div className="cart-header-row">
            <span>Product</span>
            <span>Price</span>
            <span>QTY</span>
            <span>Total</span>
          </div>
        )}

        {!cart?.items?.length ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <button className="cart-shop-btn" onClick={() => navigate('/collections')}>
              Shop Now
            </button>
          </div>
        ) : (
          cart.items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-product">
                <div className="cart-item-image-wrap">
                  <img
                    src={item.Product.imageUrl}
                    alt={item.Product.name}
                    className="cart-item-image"
                  />
                </div>
                <div className="cart-item-details">
                  <p className="cart-item-name">{item.Product.name}</p>
                  <p className="cart-item-color">color: {item.color}</p>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <p className="cart-item-price">${item.Product.price}</p>

              <div className="cart-quantity-control">
                <button
                  className="cart-qty-btn"
                  onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                >—</button>
                <span>{item.quantity}</span>
                <button
                  className="cart-qty-btn"
                  onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                >+</button>
              </div>

              <p className="cart-item-total">
                ${(parseFloat(item.Product.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>

      {cart?.items?.length > 0 && (
        <div className="cart-sidebar">
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-divider" />

            <div className="summary-row">
              <span>Items</span>
              <strong>{cart.itemCount}</strong>
            </div>
            <div className="summary-row">
              <span>Sub Total</span>
              <strong>${subtotal}</strong>
            </div>
            {discount && (
              <div className="summary-row discount">
                <span>Discount</span>
                <strong>-${discountAmount}</strong>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <strong>{shipping === 0 ? 'Free' : `$${shipping}`}</strong>
            </div>
            <div className="summary-row">
              <span>Taxes</span>
              <strong>${tax}</strong>
            </div>

            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <strong>${total}</strong>
            </div>

            <button
              className="cart-checkout-btn"
              onClick={() => navigate('/checkout', {
                state: {
                  subtotal,
                  discount: discountAmount,
                  shipping,
                  tax,
                  total,
                  couponCode: discount ? couponCode : null
                }
              })}
            >
              Proceed to Checkout
            </button>
          </div>

          <div className="cart-coupon">
            <input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value.toUpperCase())}
              className="coupon-input"
            />
            <button
              className="coupon-btn"
              onClick={handleApplyCoupon}
              disabled={couponLoading}
            >
              {couponLoading ? '...' : 'Apply Coupon'}
            </button>
          </div>
          {couponMessage && <p className="coupon-message">{couponMessage}</p>}
        </div>
      )}
    </div>
  )
}

export default CartPage