'use client'

import { Product } from '@/sanity.types'
import { useCart } from '@/context/CartContext'
import { Button } from './ui/button'
import { toast } from 'sonner'

interface QuantitySelectorProps {
  product: Product
  className?: string
  isOutOfStock?: boolean
}

const QuantitySelector = ({ product, className, isOutOfStock }: QuantitySelectorProps) => {
  const { addItem, getItemCount } = useCart()
  const currentQuantity = getItemCount(product._id)

  const handleIncrement = () => {
    if (currentQuantity >= (product.stock ?? 0)) {
      toast.error('Maximum stock limit reached')
      return
    }
    addItem(product)
  }

  const handleDecrement = () => {
    if (currentQuantity > 0) {
      addItem(product, -1)
    }
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        onClick={handleDecrement}
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentQuantity === 0 || isOutOfStock}
      >
        -
      </Button>
      <span className="w-8 text-center">{currentQuantity}</span>
      <Button
        onClick={handleIncrement}
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentQuantity >= (product.stock ?? 0) || isOutOfStock}
      >
        +
      </Button>
    </div>
  )
}

export default QuantitySelector