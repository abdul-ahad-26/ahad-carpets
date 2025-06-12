'use client'
// Import necessary dependencies
import { urlFor } from "@/sanity/lib/image"
import { useCart } from "@/context/CartContext"
import { SignInButton, useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import Loader from "@/components/Loader"
import { createCheckoutSession, Metadata } from "@/actions/createCheckoutSession"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingCart, ArrowLeft } from "lucide-react"
import QuantitySelector from "@/components/QuantitySelector"
import { toast } from "sonner"

function CartPage() {
  // Get cart functions and user authentication state
  const {
      removeItemCompletely,
    clearCart,
    getTotalPrice,
    getGroupedItems
  } = useCart()
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  // State management for client-side rendering and loading states
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Set client-side rendering flag on mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show loader while client-side rendering is not ready
  if (!isClient) {
    return <Loader />
  }

  // Get grouped cart items
  const groupedItems = getGroupedItems()

  // Handle checkout process
  const handleCheckout = async () => {
    if (!isSignedIn) return;
    setIsLoading(true)

    try {
      // Prepare metadata for checkout session
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user!.id,
      }

      // Create checkout session and handle response
      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);
      if (checkoutUrl && typeof checkoutUrl === 'string') {
        window.location.href = checkoutUrl
      } else if (checkoutUrl && typeof checkoutUrl === 'object' && 'error' in checkoutUrl) {
        toast.error(checkoutUrl.error)
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast.error("Failed to create checkout session")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle cart clearing
  const handleClearCart = () => {
    clearCart()
    toast.success("Cart cleared successfully")
  }

  // Render empty cart state
  if (groupedItems.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="bg-gray-50 p-8 rounded-full">
          <ShoppingCart className="w-20 h-20 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Your Cart is Empty</h1>
        <p className="text-gray-600 text-lg text-center max-w-md">
          Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
        </p>
        <Button
          onClick={() => router.push('/')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Continue Shopping
        </Button>
      </div>
    )
  }

  // Main cart view with items
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Cart header with title and clear cart button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">You have {groupedItems.length} item{groupedItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>
        <Button
          variant="destructive"
          onClick={handleClearCart}
          className="flex items-center gap-2 hover:bg-red-600 transition-all duration-200"
        >
          <Trash2 className="w-4 h-4" />
          Clear Cart
        </Button>
      </div>

      {/* Cart content layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items list */}
        <div className="flex-grow space-y-4">
          {groupedItems.map((item) => (
            <div
              key={item.product._id}
              className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white group">
              <div className="flex items-center justify-between">
                {/* Product information and image */}
                <div
                  className="flex items-center cursor-pointer flex-1 min-w-0 group"
                  onClick={() => router.push(`/product/${item.product.slug?.current}`)}>
                  <div className="w-24 h-24 flex-shrink-0 mr-6 relative overflow-hidden rounded-lg">
                    {item.product.image && (
                      <Image
                        src={urlFor(item.product.image).url()}
                        alt={item.product.name ?? "Product image"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        width={96}
                        height={96}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.product.name}
                    </h2>
                    <p className="text-lg text-gray-700 mt-1">
                      ${((item.product.price ?? 0) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      ${item.product.price?.toFixed(2)} each
                    </p>
                  </div>
                </div>

                {/* Quantity selector and remove button */}
                <div className="flex items-center gap-6">
                  <QuantitySelector product={item.product} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      removeItemCompletely(item.product._id)
                      toast.success("Item removed from cart")
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:w-96 bg-white p-6 rounded-xl shadow-sm h-fit sticky top-4">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Order Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Items</span>
              <span>{groupedItems.reduce((total, item) => total + item.quantity, 0)}</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout button - conditional rendering based on auth state */}
          {isSignedIn ? (
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 transition-all duration-200 hover:scale-[1.02]"
            >
              {isLoading ? "Processing..." : 'Proceed to Checkout'}
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02]">
                Sign in to Checkout
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartPage
