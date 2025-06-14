'use client'

import { Product } from '@/sanity.types'
import { useCart } from '@/context/CartContext'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useState } from 'react'
import { ConfirmationDialog } from './ui/confirmation-dialog'

interface QuantitySelectorProps {
  product: Product
  className?: string
  isOutOfStock?: boolean
}

const QuantitySelector = ({ product, className, isOutOfStock }: QuantitySelectorProps) => {
  const { addItem, getItemCount } = useCart()
  const currentQuantity = getItemCount(product._id)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleIncrement = () => {
    if (currentQuantity >= (product.stock ?? 0)) {
      toast.error('Maximum stock limit reached')
      return
    }
    addItem(product)
  }

  const handleDecrement = () => {
    if (currentQuantity > 0) {
      if (currentQuantity === 1) {
        setShowConfirmDialog(true)
        return
      }
      addItem(product, -1)
    }
  }

  const handleConfirmDecrement = () => {
    addItem(product, -1)
  }

  return (
    <>
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          onClick={handleDecrement}
          variant="outline"
          size="icon"
          className="h-8 w-8 hover:bg-gray-100 focus:bg-transparent active:bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={currentQuantity === 0 || isOutOfStock}
        >
          -
        </Button>
        <span className="w-8 text-center">{currentQuantity}</span>
        <Button
          onClick={handleIncrement}
          variant="outline"
          size="icon"
          className="h-8 w-8 hover:bg-gray-100 focus:bg-transparent active:bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={currentQuantity >= (product.stock ?? 0) || isOutOfStock}
        >
          +
        </Button>
      </div>

      <ConfirmationDialog
      
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmDecrement}
        title="Remove Item"
        description="Are you sure you want to remove this item from your cart?"
        confirmText="Yes, remove"
        cancelText="Keep in cart"
      />
    </>
  )
}

export default QuantitySelector