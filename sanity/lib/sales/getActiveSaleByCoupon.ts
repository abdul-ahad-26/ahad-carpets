import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getActiveSaleByCouponCode =  async (couponCode: string) => {

    const ACTIVE_SALE_BY_COUPON_QUERY = defineQuery(`
        *[_type == "sale" && 
        isActive == true && 
        couponCode == $couponCode &&
        validFrom <= now() &&
        ((!defined(validUntil)) || (validUntil >= now( )))
        ] 
        | order(validFrom desc)[0]
        `);

        try {
            const activateSale= await sanityFetch({
                query: ACTIVE_SALE_BY_COUPON_QUERY,
                params:{
                    couponCode,
                },
            })
            return activateSale ? activateSale.data : null
        } catch (error){
            console.error("error fetching activate sale by coupon code:", error)
            return null

        }

}