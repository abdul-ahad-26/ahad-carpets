'use client'

import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useWishlist } from '@/context/WishlistContext'
import { toast } from 'sonner'
import { Heart, ArrowLeft, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'

export default function WishlistPage() {
  const { items, removeItem } = useWishlist()
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(null)

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName })
  }

  const confirmRemove = () => {
    if (selectedProduct) {
      removeItem(selectedProduct.id)
      toast.success('Removed from wishlist')
      setSelectedProduct(null)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh] space-y-8">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-full shadow-inner">
          <Heart className="w-24 h-24 text-gray-400" />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">Your Wishlist is Empty</h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Looks like you haven&apos;t added any items to your wishlist yet. Start shopping to fill it up!
          </p>
        </div>
        <Link href="/">
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Your Wishlist</h1>
          <p className="text-gray-600 mt-2 text-lg">You have {items.length} item{items.length !== 1 ? 's' : ''} in your wishlist</p>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {items.map((product) => {
          const hasDiscount = product.discount && product.discount > 0;
          const discountedPrice = hasDiscount && product.price && product.discount
            ? product.price * (1 - product.discount / 100)
            : product.price;

          return (
            <div
              key={product._id}
              className="flex items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <Link href={`/product/${product.slug?.current}`} className="flex-shrink-0">
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-200">
                  {product.images && (
                    <Image
                      src={urlFor(product.images[0]).url()}
                      alt={product.name ?? 'Product image'}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-200"
                    />
                  )}
                </div>
              </Link>

              <div className="ml-6 flex-grow">
                <Link href={`/product/${product.slug?.current}`}>
                  <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                    {product.name}
                  </h2>
                </Link>
                <div className="flex items-baseline gap-3 mt-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl font-bold text-gray-900">
                        ${discountedPrice?.toFixed(2)}
                      </span>
                      <span className="text-base text-gray-500 line-through">
                        ${product.price?.toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                        -{product.discount}%
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price?.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-auto flex items-center">
                <Button
                  variant="ghost"
                  onClick={() => handleRemoveFromWishlist(product._id, product.name ?? '')}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <ConfirmationDialog
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onConfirm={confirmRemove}
        title="Remove from Wishlist"
        description={`Are you sure you want to remove "${selectedProduct?.name}" from your wishlist?`}
        confirmText="Yes, remove"
        cancelText="Cancel"
      />
    </div>
  )
}