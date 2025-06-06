import { Product } from '@/sanity.types';
import ProductGrid from './ProductGrid';

interface RelatedProductsProps {
    products: Product[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
    if (!products.length) return null;

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
            <ProductGrid products={products} />
        </div>
    );
};

export default RelatedProducts; 