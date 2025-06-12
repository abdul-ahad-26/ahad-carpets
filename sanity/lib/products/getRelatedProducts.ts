import { defineQuery } from "next-sanity"
import { sanityFetch } from "../live";

export const getRelatedProducts = async (currentProductId: string, categoryIds: string[]) => {
    const RELATED_PRODUCTS_QUERY = defineQuery(`
        *[_type == "product" 
        && _id != $currentProductId 
        && stock > 0
        && count((category[]->_id)[@ in $categoryIds]) > 0] 
        | order(name asc) [0...4]
    `);
    
    try {
        const products = await sanityFetch({
            query: RELATED_PRODUCTS_QUERY,
            params: {
                currentProductId,
                categoryIds
            }
        });

        return products.data || [];
    } catch (error) {
        console.log("Error fetching related products:", error);
        return [];
    }
} 