// Import necessary dependencies
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { Product } from "@/sanity.types";

// Define the structure of a cart item
export interface CartItem {
    product: Product;
    quantity: number;
}

// Define the cart store state interface
interface CartState {
    items: CartItem[];                    // Array of items in cart
    addItem: (product: Product) => void;  // Add item to cart
    removeItem: (productId: string) => void; // Remove item from cart
    removeItemCompletely: (productId: string) => void; // Remove item completely from cart
    clearCart: (showToast?: boolean) => void;               // Clear all items from cart
    getTotalPrice: () => number;         // Calculate total price
    getItemCount: (productId: string) => number; // Get quantity of specific item
    getGroupedItems: () => CartItem[];   // Get all items in cart
}

// Create the cart store with persistence
const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            // Initialize empty cart
            items: [],

            // Add item to cart or increase quantity if exists
            addItem: (product) =>
                set((state) => {
                    const existingItem = state.items.find(
                        (item) => item.product._id === product._id
                    );
            
                    // If product already in cart
                    if (existingItem) {
                        const currentQty = existingItem.quantity;
            
                        if (currentQty > 0) {
                            toast.success("Item quantity increased");
                        } else {
                            toast.success("Item added to cart with quantity 1");
                        }
            
                        return {
                            items: state.items.map((item) =>
                                item.product._id === product._id
                                    ? { ...item, quantity: currentQty + 1 }
                                    : item
                            ),
                        };
                    }
            
                    // If not in cart
                    toast.success("Item added to cart");
                    return {
                        items: [...state.items, { product, quantity: 1 }],
                    };
                }),
            

            // Remove item from cart or decrease quantity
            removeItem: (productId) =>
                set((state) => {
                    const item = state.items.find(item => item.product._id === productId);
                    if (item?.quantity === 1) {
                        toast.success("Item removed from cart");
                    } else {
                        toast.success("Item quantity decreased");
                    }
                    return {
                        items: state.items.reduce((acc, item) => {
                            if (item.product._id === productId) {
                                if (item.quantity > 1) {
                                    acc.push({ ...item, quantity: item.quantity - 1 });
                                }
                            } else {
                                acc.push(item);
                            }
                            return acc;
                        }, [] as CartItem[]),
                    };
                }),

            // Remove item completely from cart
            removeItemCompletely: (productId) =>
                set((state) => {
                    toast.success("Item removed from cart");
                    return {
                        items: state.items.filter(item => item.product._id !== productId)
                    };
                }),

            // Clear all items from cart
            clearCart: (showToast = true) => {
                if (showToast) {
                    toast.success("Cart cleared");
                }
                set({ items: [] });
            },

            // Calculate total price of all items
            getTotalPrice: () => {
                return get().items.reduce((total, item) => {
                    return total + (item.product.price ?? 0) * item.quantity;
                }, 0);
            },

            // Get quantity of specific item
            getItemCount: (productId) => {
                const item = get().items.find(
                    (item) => item.product._id === productId
                );
                return item ? item.quantity : 0;
            },

            // Get all items in cart
            getGroupedItems: () => get().items,
        }),
        {
            name: "cart-store", // Name for persistent storage
        }
    )
);

export default useCartStore;
