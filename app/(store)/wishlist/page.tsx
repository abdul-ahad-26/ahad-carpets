'use client'

import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { toast } from 'sonner'
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react'
import { Product } from '@/sanity.types'

export default function WishlistPage() {
  const { items, removeItem } = useWishlist()
  const { addItem, getItemCount } = useCart()

  const handleAddToCart = (product: Product) => {
    // Check if product is out of stock
    if (product.stock === 0) {
      toast.error('This item is out of stock')
      return
    }

    // Check if adding would exceed stock limit
    const currentCartQuantity = getItemCount(product._id)
    if (product.stock !== undefined && currentCartQuantity >= product.stock) {
      toast.error(`Cannot add more than ${product.stock} items`)
      return
    }

    addItem(product)
    toast.success('Added to cart')
  }

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    if (window.confirm(`Do you want to remove "${productName}" from your wishlist?`)) {
      removeItem(productId)
      toast.success('Removed from wishlist')
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="bg-gray-50 p-8 rounded-full">
          <Heart className="w-20 h-20 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Your Wishlist is Empty</h1>
        <p className="text-gray-600 text-lg text-center max-w-md">
          Looks like you haven&apos;t added any items to your wishlist yet. Start shopping to fill it up!
        </p>
        <Link href="/">
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
          <p className="text-gray-600 mt-1">You have {items.length} item{items.length !== 1 ? 's' : ''} in your wishlist</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <div 
            key={product._id} 
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
          >
            <Link href={`/product/${product.slug?.current}`}>
              <div className="relative aspect-square overflow-hidden">
                {product.image && (
                  <Image
                    src={urlFor(product.image).url()}
                    alt={product.name ?? 'Product image'}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
            </Link>
            <div className="p-6">
              <Link href={`/product/${product.slug?.current}`}>
                <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors duration-200">
                  {product.name}
                </h2>
              </Link>
              <div className="flex items-center justify-between mb-4">
                <p className="text-2xl font-bold text-emerald-600">
                  ${product.price?.toFixed(2)}
                </p>
                {product.stock !== undefined && (
                  <p className="text-sm text-gray-500">
                    {product.stock} in stock
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRemoveFromWishlist(product._id, product.name ?? '')}
                  className="w-full py-3 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Remove from Wishlist
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 