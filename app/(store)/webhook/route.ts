import { Metadata } from "@/actions/createCheckoutSession";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateProductStock } from "@/actions/updateProductStock";

type StripeSession = Stripe.Checkout.Session & {
    shipping_details?: {
        address?: {
            line1?: string;
            city?: string;
            state?: string;
            postal_code?: string;
            country?: string;
        };
    };
};

export async function POST(req: NextRequest) {
    const body = await req.text();
    const headerList = await headers();
    const sig = headerList.get("stripe-signature")

    // console.log("WEBHOOK HIT")

    if (!sig) {
        return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.log("⚠ Stripe webhook secret is not set.");
        return NextResponse.json(
            { error: "Stripe webhook secret is not set" },
            { status: 400 }
        )
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err) {
        console.error("Webhook signature verification failed:", err)
        return NextResponse.json(
            { error: `Webhook Error: ${err}` },
            { status: 400 }
        );
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as StripeSession;

        try {
            const order = await createOrderInSanity(session);
            console.log("Order created in Sanity:", order);
        } catch (err) {
            console.error("Error creating order in sanity:", err);
            return NextResponse.json(
                { error: "Error creating an order" },
                { status: 500 }
            );
        }
    }

    return NextResponse.json({ received: true })
}

async function createOrderInSanity(session: StripeSession) {
    const { orderNumber, customerName, customerEmail, clerkUserId } =
        session.metadata as Metadata

    const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
            expand: ["data.price.product"],
        }
    );

    const sanityProducts = lineItemsWithProduct.data.map((item) => ({
        _key: crypto.randomUUID(),
        product: {
            _type: "reference",
            _ref: (item.price?.product as Stripe.Product)?.metadata?.id ,
        },
        quantity: item.quantity || 0,
    }));

    // Update stock for each product
    for (const item of lineItemsWithProduct.data) {
        const productId = (item.price?.product as Stripe.Product)?.metadata?.id;
        if (productId) {
            await updateProductStock(productId, item.quantity || 0);
        }
    }

    const order = await backendClient.create({
        _type: "order",
        orderNumber,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        customerName,
        stripeCustomerId: session.customer,
        clerkUserId: clerkUserId,
        email: customerEmail,
        phone: session.customer_details?.phone || '',
        currency: session.currency,
        amountDiscount: session.total_details?.amount_discount ? session.total_details.amount_discount / 100 : 0,
        products: sanityProducts,
        totalPrice: session.amount_total ? session.amount_total / 100 : 0,
        status: "paid",
        orderDate: new Date().toISOString(),
        shippingAddress: session.shipping_details?.address ? {
            street: session.shipping_details.address.line1,
            city: session.shipping_details.address.city,
            state: session.shipping_details.address.state,
            postalCode: session.shipping_details.address.postal_code,
            country: session.shipping_details.address.country,
        } : undefined,
    })

    return order;
}