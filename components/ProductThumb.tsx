import { Product } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import WishlistButton from './WishlistButton';

const ProductThumb = ({ product }: { product: Product }) => {
  const isOutOfStock = product.stock === 0;
    const productUrl = `/product/${product.slug?.current}`;
  const productImageUrl = product.image ? urlFor(product.image).url() : '';

  return (
    <div
      className={`group flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
        isOutOfStock ? 'opacity-60 pointer-events-none' : ''
      }`}
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
              className="object-contain group-hover:scale-105 transition-transform duration-300"
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
            <h2 className="text-lg font-semibold text-gray-800 truncate hover:underline">
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

        {/* Price, Wishlist & Button */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ${product.price?.toFixed(2)}
            </span>
            <WishlistButton product={product} size="lg" />
          </div>

          <Link
            href={productUrl}
            className="mt-3 block w-full text-center py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductThumb;
