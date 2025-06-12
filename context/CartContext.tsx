'use client'

// Import necessary dependencies
import { Product } from "@/sanity.types"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
// import { toast } from "sonner"
import toast from "react-hot-toast";

// Define the structure of a cart item with product and quantity
export interface CartItem {
  product: Product
  quantity: number
}

// Define the context type with all available cart operations
interface CartContextType {
  items: CartItem[]  // Array of items in cart
  addItem: (product: Product, quantity?: number) => void  // Add item to cart
  removeItem: (productId: string) => void  // Decrease item quantity by 1
  removeItemCompletely: (productId: string) => void  // Remove item entirely
  clearCart: (showToast?: boolean) => void  // Clear all items
  getTotalPrice: () => number  // Calculate total price
  getItemCount: (productId: string) => number  // Get quantity of specific item
  getGroupedItems: () => CartItem[]  // Get all items
}

// Initialize cart context with undefined as default value
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart provider component that manages cart state and operations
export function CartProvider({ children }: { children: ReactNode }) {
  // State to store cart items
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart data from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Persist cart data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  // Add item to cart or increase quantity if item exists
  const addItem = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product._id === product._id)
  
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
  
        if (newQuantity <= 0) {
          // Remove item from cart if quantity becomes zero or negative
          toast.success("Item removed from cart")
          return prevItems.filter(item => item.product._id !== product._id)
        }
  
        return prevItems.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: newQuantity }
            : item
        )
      }
  
      // Prevent adding item with 0 or negative quantity
      if (quantity <= 0) return prevItems
  
      return [...prevItems, { product, quantity }]
    })
  }
  

  // Decrease item quantity by 1 or remove if quantity becomes 0
  const removeItem = (productId: string) => {
    setItems(currentItems => {
      const item = currentItems.find(item => item.product._id === productId)
      // Show appropriate toast message
      if (item?.quantity === 1) {
        toast.success("Item removed from cart")
      } else {
        toast.success("Item quantity decreased")
      }

      // Filter out items with quantity 0 and decrease others
      return currentItems.reduce((acc, item) => {
        if (item.product._id === productId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 })
          }
        } else {
          acc.push(item)
        }
        return acc
      }, [] as CartItem[])
    })
  }

  // Remove item completely from cart
  const removeItemCompletely = (productId: string) => {
    setItems(currentItems => {
      toast.success("Item removed from cart")
      return currentItems.filter(item => item.product._id !== productId)
    })
  }

  // Clear all items from cart
  const clearCart = (showToast = true) => {
    if (showToast) {
      toast.success("Cart cleared")
    }
    setItems([])
  }

  // Calculate total price of all items
  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + (item.product.price ?? 0) * item.quantity
    }, 0)
  }

  // Get quantity of specific item by product ID
  const getItemCount = (productId: string) => {
    const item = items.find(item => item.product._id === productId)
    return item ? item.quantity : 0
  }

  // Get all items in cart
  const getGroupedItems = () => items

  // Provide cart context to children components
  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        removeItemCompletely,
        clearCart,
        getTotalPrice,
        getItemCount,
        getGroupedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to access cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 