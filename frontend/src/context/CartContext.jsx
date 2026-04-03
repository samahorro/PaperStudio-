import { createContext, useContext, useState, useEffect } from 'react'
import { getCart, addToCart, updateCartItem, removeCartItem } from '../utils/api'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [cartLoading, setCartLoading] = useState(false)

  const fetchCart = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    setCartLoading(true)
    const data = await getCart(token)
    setCart(data)
    setCartLoading(false)
  }

  const addItem = async (productId, quantity, color) => {
    const token = localStorage.getItem('token')
    const data = await addToCart(token, productId, quantity, color)
    await fetchCart() // refresh cart after adding
    return data
  }

  const updateItem = async (cartItemId, quantity) => {
    const token = localStorage.getItem('token')
    await updateCartItem(token, cartItemId, quantity)
    await fetchCart()
  }

  const removeItem = async (cartItemId) => {
    const token = localStorage.getItem('token')
    await removeCartItem(token, cartItemId)
    await fetchCart()
  }

  // fetch cart when user logs in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) fetchCart()
  }, [])

  return (
    <CartContext.Provider value={{
      cart,
      cartLoading,
      fetchCart,
      addItem,
      updateItem,
      removeItem
    }}>
      {children}
    </CartContext.Provider>
  )
}

// custom hook — lets any component grab cart easily
export function useCart() {
  return useContext(CartContext)
}