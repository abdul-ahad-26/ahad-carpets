'use client'

import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function WhatsAppButton() {
  const pathname = usePathname()
  const { items: cartItems } = useCart()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Don't show on auth pages or modals
  if (pathname?.includes('/sign-in') || pathname?.includes('/sign-up')) {
    return null
  }

  const getMessage = () => {
    // Check if we're on a product page
    if (pathname?.includes('/product/')) {
      // Get product name from URL and decode it
      const productName = decodeURIComponent(pathname.split('/product/')[1].split('-').join(' '))
      
      // Find the product in cart items to get its details
      const productInCart = cartItems.find(item => 
        item.product.name?.toLowerCase() === productName.toLowerCase()
      )

      let message = `Hi, I have a question about this product:\n\n`
      message += `Product Name: ${productName}\n`
      
      if (productInCart) {
        message += `Price: $${productInCart.product.price?.toFixed(2)}\n`
        if (productInCart.product.description) {
          // Get first 100 characters of description
          const description = productInCart.product.description
            .map(block => 
              block._type === 'block' 
                ? block.children?.map(child => child.text).join(' ')
                : ''
            )
            .join(' ')
            .slice(0, 100) + '...'
          message += `Description: ${description}\n`
        }
      }

      message += `\nProduct URL: ${window.location.href}`
      return message
    }

    if (pathname?.includes('/cart')) {
      let message = `Hi, I need help with my cart.\n\n`
      message += `Number of items: ${itemCount}\n\n`
      message += `Items in cart:\n`
      cartItems.forEach(item => {
        message += `- ${item.product.name} (${item.quantity} x $${item.product.price?.toFixed(2)})\n`
      })
      message += `\nTotal: $${cartItems.reduce((total, item) => total + (item.product.price ?? 0) * item.quantity, 0).toFixed(2)}`
      return message
    }

    return 'Hi, I have a question about your products.'
  }

  const handleClick = () => {
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    const phoneNumber = '923170294505' // Your WhatsApp number
    const message = encodeURIComponent(getMessage())
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
    setShowConfirmation(false)
  }

  const handleCancel = () => {
    setShowConfirmation(false)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon />
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Confirm WhatsApp Message</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 max-h-60 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {getMessage()}
              </pre>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-[#25D366] text-white rounded hover:bg-[#128C7E] transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 