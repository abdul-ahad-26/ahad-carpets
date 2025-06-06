'use client'

import { Product } from "@/sanity.types"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { toast } from "sonner"

interface WishlistContextType {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      setItems(JSON.parse(savedWishlist))
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items))
  }, [items])

  const addItem = (product: Product) => {
    setItems(currentItems => {
      if (!currentItems.find(item => item._id === product._id)) {
        toast.success('Item added to wishlist')
        return [...currentItems, product]
      }
      return currentItems
    })
  }

  const removeItem = (productId: string) => {
    setItems(currentItems => {
      toast.success('Item removed from wishlist')
      return currentItems.filter(item => item._id !== productId)
    })
  }

  const isInWishlist = (productId: string) => {
    return items.some(item => item._id === productId)
  }

  const clearWishlist = () => {
    toast.success('Wishlist cleared')
    setItems([])
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
} 