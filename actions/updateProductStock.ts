'use server'

import { backendClient } from "@/sanity/lib/backendClient";

export async function updateProductStock(productId: string, quantity: number) {
  try {
    // Get current product
    const product = await backendClient.getDocument(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    // Calculate new stock
    const currentStock = product.stock ?? 0;
    const newStock = Math.max(0, currentStock - quantity);

    // Update product stock
    await backendClient
      .patch(productId)
      .set({ stock: newStock })
      .commit();

    return true;
  } catch (error) {
    console.error('Error updating product stock:', error);
    return false;
  }
} 