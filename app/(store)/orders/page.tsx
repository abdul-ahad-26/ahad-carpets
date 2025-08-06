        import formatCurrency from '@/lib/formatCurrency';
        import getMyOrders from '@/sanity/lib/orders/getMyOrders';
        import { auth } from '@clerk/nextjs/server'
        import { redirect } from 'next/navigation';
        import Image from 'next/image';
        import { urlFor } from '@/sanity/lib/image';

        async function Orders() {
            const { userId } = await auth();

            if (!userId) {
                return redirect('/')
            }
            
            const orders = await getMyOrders(userId)
            // console.log("orders>>>", orders)

            return (
                <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
                    <div className='max-w-7xl mx-auto'>
                        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
                            <div className='px-4 py-5 sm:px-6 border-b border-gray-200'>
                                <h1 className='text-3xl font-bold text-gray-900'>
                                    My Orders
                                </h1>
                                <p className='mt-1 text-sm text-gray-500'>
                                    View and track your order history
                                </p>
                            </div>

                            <div className='divide-y divide-gray-200'>
                                {orders.length === 0 ? (
                                    <div className='p-8 text-center'>
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <h3 className='mt-2 text-sm font-medium text-gray-900'>No orders</h3>
                                        <p className='mt-1 text-sm text-gray-500'>You have not placed any orders yet.</p>
                                    </div>
                                ) : (
                                    orders.map((order) => (
                                        <div key={order.orderNumber} className='p-6 sm:p-8'>
                                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                                                {/* Order Details */}
                                                <div className='space-y-6'>
                                                    <div className='bg-gray-50 rounded-lg p-4'>
                                                        <div className='flex items-center justify-between mb-4'>
                                                            <div>
                                                                <p className='text-sm font-medium text-gray-500'>Order Number</p>
                                                                <p className='mt-1 text-sm font-mono text-green-600'>{order.orderNumber}</p>
                                                            </div>
                                                            <div className='text-right'>
                                                                <p className='text-sm font-medium text-gray-500'>Status</p>
                                                                <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                    order.status === "paid" ? "bg-green-100 text-green-800" :
                                                                    order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                                                                    order.status === "delivered" ? "bg-purple-100 text-purple-800" :
                                                                    "bg-gray-100 text-gray-800"
                                                                }`}>
                                                                    {(order.status ?? '').charAt(0).toUpperCase() + (order.status ?? '').slice(1)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className='grid grid-cols-2 gap-4'>
                                                            <div>
                                                                <p className='text-sm font-medium text-gray-500'>Order Date</p>
                                                                <p className='mt-1 text-sm text-gray-900'>
                                                                    {order.orderDate ? new Date(order.orderDate).toLocaleString() : "N/A"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className='text-sm font-medium text-gray-500'>Total Amount</p>
                                                                <p className='mt-1 text-sm font-semibold text-gray-900'>
                                                                    {formatCurrency(order.totalPrice ?? 0, order.currency)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Shipping Information */}
                                                    <div className='bg-gray-50 rounded-lg p-4'>
                                                        <h3 className='text-sm font-medium text-gray-900 mb-4'>Shipping Information</h3>
                                                        <div className='space-y-4'>
                                                            <div className='flex items-start'>
                                                                <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <div>
                                                                    <p className='text-sm font-medium text-gray-900'>Shipping Address</p>
                                                                    {order.shippingAddress ? (
                                                                        <p className='mt-1 text-sm text-gray-500'>
                                                                            {order.shippingAddress.street}<br />
                                                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                                                                            {order.shippingAddress.country}
                                                                        </p>
                                                                    ) : (
                                                                        <p className='mt-1 text-sm text-gray-500'>No shipping address provided</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className='flex items-start'>
                                                                <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                                <div>
                                                                    <p className='text-sm font-medium text-gray-900'>Phone Number</p>
                                                                    <p className='mt-1 text-sm text-gray-500'>
                                                                        {order.phone || 'No phone number provided'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {order.amountDiscount ? (
                                                        <div className='bg-red-50 rounded-lg p-4'>
                                                            <p className='text-sm font-medium text-red-800'>
                                                                Discount Applied: {formatCurrency(order.amountDiscount, order.currency)}
                                                            </p>
                                                            <p className='mt-1 text-sm text-red-600'>
                                                                Original Subtotal: {formatCurrency(
                                                                    (order.totalPrice ?? 0) + order.amountDiscount,
                                                                    order.currency
                                                                )}
                                                            </p>
                                                        </div>
                                                    ) : null}
                                                </div>

                                                {/* Order Items */}
                                                <div className='bg-gray-50 rounded-lg p-4'>
                                                    <h3 className='text-sm font-medium text-gray-900 mb-4'>Order Items</h3>
                                                    <div className='space-y-4'>
                                                        {order.products?.map((product) => (
                                                            <div key={`${order.orderNumber}-${product.product?._id || ''}-${product._key || Math.random()}`} className='flex items-center space-x-4'>
                                                                {product.product?.images && (
                                                                    <div className='relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden'>
                                                                        <Image
                                                                            src={urlFor(product.product.images[0]).url()}
                                                                            alt={product.product?.name ?? ""}
                                                                            className="object-cover"
                                                                            fill
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div className='flex-1 min-w-0'>
                                                                    <p className='text-sm font-medium text-gray-900 truncate'>
                                                                        {product.product?.name}
                                                                    </p>
                                                                    <p className='text-sm text-gray-500'>
                                                                        Quantity: {product.quantity}
                                                                    </p>
                                                                </div>
                                                                <p className='text-sm font-medium text-gray-900'>
                                                                    {product.product?.price && product.quantity
                                                                        ? formatCurrency(product.product.price * product.quantity, order.currency)
                                                                        : "N/A"}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        export default Orders