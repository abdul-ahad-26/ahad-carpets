    'use server'

    import stripe from "@/lib/stripe";
    import { urlFor } from "@/sanity/lib/image";
    import { CartItem } from "@/context/CartContext"

    export type Metadata = {
        orderNumber: string;
        customerName: string;
        customerEmail: string;
        clerkUserId: string;
    }

    export type groupedBasketItem = CartItem;

    export async function createCheckoutSession(
        items: groupedBasketItem[],
        metadata: Metadata
    ) {
        try {
            // check if any ground items dont have a price
            const itemsWithoutPrice = items.filter((item) => !item.product.price);
            if (itemsWithoutPrice.length > 0) {
                throw new Error("Some items do not have a price")
            }

            //Search for existing customer by email 
            const customers = await stripe.customers.list({
                email: metadata.customerEmail,
                limit: 1,
            });

            let customerId: string | undefined
            if (customers.data.length > 0) {
                customerId = customers.data[0].id;
            }

            const baseUrl = process.env.NODE_ENV === 'production'?
            `https://${process.env.VERCEL_URL}`:
            `${process.env.NEXT_PUBLIC_BASE_URL}`

            const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`
            const cancelUrl = `${baseUrl}/basket`

            const session = await stripe.checkout.sessions.create({
                customer: customerId,
                customer_creation: customerId ? undefined : "always",
                customer_email: !customerId ? metadata.customerEmail : undefined,
                metadata,
                mode: "payment",
                allow_promotion_codes: true,
                success_url: successUrl,
                cancel_url: cancelUrl,
                shipping_address_collection: {
                    allowed_countries: ['US', 'CA', 'GB', 'AU', 'PK'], // Add more countries as needed
                },
                phone_number_collection: {
                    enabled: true,
                },
                line_items: items.map((item) => ({
                    price_data: {
                        currency: 'usd',
                        unit_amount: Math.round(item.product.price! * 100),
                        product_data: {
                            name: item.product.name || "Unnamed Product",
                            description: `Product ID: ${item.product._id}`,
                            metadata: {
                                id: item.product._id,
                            },
                            images: item.product.image ? [urlFor(item.product.image).url()] : undefined,
                        },
                    },
                    quantity: item.quantity
                }))
            })

            return session.url;
        } catch (error: any) {
            console.error("Checkout error", error.message);
            return { error: "Unable to create Stripe session. Please try again." };
        }
    }