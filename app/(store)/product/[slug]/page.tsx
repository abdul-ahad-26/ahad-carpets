// ProductPage.tsx
import getProductBySlug from "@/sanity/lib/products/getProductBySlug";
import { getRelatedProducts } from "@/sanity/lib/products/getRelatedProducts";
import { notFound } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import ProductDescription from "@/components/ProductDescription";
import WishlistButton from "@/components/WishlistButton";
import RelatedProducts from "@/components/RelatedProducts";
import WhatsAppButton from "@/components/WhatsAppButton";
import QuantitySelector from "@/components/QuantitySelector";


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

  // Get related products
  const categoryIds = product.category?.map(cat => cat._ref) || [];
  const relatedProducts = await getRelatedProducts(product._id, categoryIds);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 bg-white rounded-3xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Product Image */}
        <div className="relative">
          <div
            className={`relative aspect-square overflow-hidden rounded-3xl shadow-2xl bg-gray-50 ${
              isOutOfStock ? "opacity-50" : ""
            }`}
          >
            {product.image && (
              <Image
                src={urlFor(product.image).url()}
                alt={product.name ?? "Product image"}
                fill
                className="object-contain transition-transform duration-500 hover:scale-105"
              />
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl">
                <span className="text-white text-xl sm:text-2xl font-semibold bg-black/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-sm">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
          <div className="absolute top-4 right-4 z-10">
            <WishlistButton product={product} size="lg" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between p-4">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">{product.name}</h1>
            <div className="text-2xl sm:text-3xl text-emerald-600 font-semibold">
              ${product.price?.toFixed(2)}
            </div>
            
            {/* Collapsible Description */}
            {Array.isArray(product.description) && (
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
                <ProductDescription description={product.description} />
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8">
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
