'use client'

import { Product } from "@/sanity.types"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { toast } from "sonner"

// Define the structure of a cart item
export interface CartItem {
  product: Product
  quantity: number
}

// Define the context type
interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  removeItemCompletely: (productId: string) => void
  clearCart: (showToast?: boolean) => void
  getTotalPrice: () => number
  getItemCount: (productId: string) => number
  getGroupedItems: () => CartItem[]
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Create the provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product._id === product._id)
      if (existingItem) {
        return prevItems.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prevItems, { product, quantity }]
    })
  }

  const removeItem = (productId: string) => {
    setItems(currentItems => {
      const item = currentItems.find(item => item.product._id === productId)
      if (item?.quantity === 1) {
        toast.success("Item removed from cart")
      } else {
        toast.success("Item quantity decreased")
      }

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

  const removeItemCompletely = (productId: string) => {
    setItems(currentItems => {
      toast.success("Item removed from cart")
      return currentItems.filter(item => item.product._id !== productId)
    })
  }

  const clearCart = (showToast = true) => {
    if (showToast) {
      toast.success("Cart cleared")
    }
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + (item.product.price ?? 0) * item.quantity
    }, 0)
  }

  const getItemCount = (productId: string) => {
    const item = items.find(item => item.product._id === productId)
    return item ? item.quantity : 0
  }

  const getGroupedItems = () => items

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

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 