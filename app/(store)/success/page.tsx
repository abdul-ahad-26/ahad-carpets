'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const { clearCart } = useCart()
  const router = useRouter()
  const hasClearedCart = useRef(false)

  useEffect(() => {
    // Only clear the cart once when the success page is loaded
    if (!hasClearedCart.current) {
      clearCart(false) // Pass false to prevent toast notification
      hasClearedCart.current = true
    }
  }, [clearCart])

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <CheckCircle className="w-16 h-16 text-green-500" />
      <h1 className="text-3xl font-bold text-gray-800">Order Successful!</h1>
      <p className="text-gray-600 text-lg text-center">
        Thank you for your purchase. Your order has been received and is being processed.
      </p>
      <Button 
        onClick={() => router.push('/')}
        className="mt-4"
      >
        Continue Shopping
      </Button>
    </div>
  )
}
