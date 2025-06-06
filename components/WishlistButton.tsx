'use client'

import { Product } from '@/sanity.types'
import { useWishlist } from '@/context/WishlistContext'
import { FiHeart } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

interface WishlistButtonProps {
  product: Product
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const WishlistButton = ({ product, className, size = 'md' }: WishlistButtonProps) => {
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product._id)

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
          removeItem(product._id);
        } else {
          addItem(product);
        }
      }}

      className={cn(
        'rounded-full p-1.5 transition-colors duration-200',
        isWishlisted
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-white text-gray-600 hover:bg-gray-100',
        sizeClasses[size],
        className
      )}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <FiHeart className="w-full h-full" />
    </Button>
  )
}

export default WishlistButton 