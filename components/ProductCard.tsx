import { Product } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';


const ProductCard = ({ product }: { product: Product }) => {
  const isOutOfStock = product.stock === 0;
  const productUrl = `/product/${product.slug?.current}`;
  const productImageUrl = product.image ? urlFor(product.image).url() : '';
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount && product.price && product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div
      className="group flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden 
      "
    >
      {/* Image Section */}
      <Link href={productUrl} aria-label={`View ${product.name}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100 rounded-t-2xl">
          {product.image && (
            <Image
              src={productImageUrl}
              alt={product.name || 'Product image'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-t-2xl">
              <span className="text-white text-sm md:text-base font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Info Section */}
      <div className="p-4 flex flex-col justify-between flex-1 rounded-b-2xl">
        {/* Title & Description */}
        <div>
          <Link href={productUrl}>
            <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200 line-clamp-1">
              {product.name}
            </h2>
          </Link>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {product.description?.map((block) =>
              block._type === 'block'
                ? block.children?.map((child) => child.text).join(' ')
                : ''
            ) || 'No description available'}
          </p>
        </div>

        {/* Price & Wishlist */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              {hasDiscount ? (
                <>
                  <span className="text-xl font-bold text-gray-900">
                    ${discountedPrice?.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.price?.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                    -{product.discount}%
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  ${product.price?.toFixed(2)}
                </span>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
