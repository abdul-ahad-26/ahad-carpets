import getProductBySlug from "@/sanity/lib/products/getProductBySlug";
import { getRelatedProducts } from "@/sanity/lib/products/getRelatedProducts";
import { notFound } from "next/navigation";
import ProductDescription from "@/components/ProductDescription";
import WishlistButton from "@/components/WishlistButton";
import RelatedProducts from "@/components/RelatedProducts";
import WhatsAppButton from "@/components/WhatsAppButton";
import QuantitySelector from "@/components/QuantitySelector";
import ProductImageGallery from "@/components/ProductImageGallery";


export const dynamic = "force-static"
export const revalidate = 36000 // revalidate at most every 60 seconds

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  console.log(
    crypto.randomUUID().slice(0,5) +  `>>> Rerendered the product page cache for ${slug} `
  );

  if (!product) return notFound();

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock! > 0 && product.stock! <= 5;
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount && product.price && product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  // Get related products
  const categoryIds = product.category?.map(cat => cat._ref) || [];
  const relatedProducts = await getRelatedProducts(product._id, categoryIds);


  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 bg-white rounded-3xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Product Image */}
        {/* <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl bg-gray-50">
            {product.images && (
              <Image
                src={urlFor(product.image).url()}
                alt={product.name ?? "Product image"}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            )}
          </div>
          <div className="absolute top-4 right-4 z-10">
            <WishlistButton product={product} size="lg" />
          </div>
        </div> */}
    <div className="relative">
      {product.images && <ProductImageGallery images={product.images} />}
      <div className="absolute top-4 right-4 z-10">
        <WishlistButton product={product} size="lg" />
      </div>
    </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between p-4">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">{product.name}</h1>
            <div className="flex items-baseline space-x-3">
              {hasDiscount ? (
                <>
                  <span className="text-3xl sm:text-4xl text-gray-900 font-bold">
                    ${discountedPrice?.toFixed(2)}
                  </span>
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    ${product.price?.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                    -{product.discount}%
                  </span>
                </>
              ) : (
                <span className="text-3xl sm:text-4xl text-emerald-600 font-bold">
                  ${product.price?.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Collapsible Description */}
            {Array.isArray(product.description) && (
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
                <ProductDescription description={product.description} />
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8">
            {isOutOfStock ? (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-600 font-medium">
                  Out of Stock
                </span>
              </div>
            ) : isLowStock ? (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-amber-600 font-medium">
                  Only {product.stock} left 
                </span>
              </div>
            ) : null}
            <QuantitySelector product={product} isOutOfStock={isOutOfStock} />
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};


export default ProductPage;
