"use client";

import React from "react";
import { useCartDrawer, useCart } from "@/lib/store/cart-store";

const CartDebugComponent: React.FC = () => {
  const { isOpen, setOpen } = useCartDrawer();
  const { cart, addToCart } = useCart();

  const testAddItem = async () => {
    try {
      await addToCart({
        productId: "test-product-1",
        quantity: 1,
        variantId: undefined,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-yellow-100 p-4 rounded-lg shadow-lg z-50">
      <h3 className="font-bold mb-2">Cart Debug</h3>
      <p>Cart items: {cart?.itemCount || 0}</p>
      <p>Drawer open: {isOpen ? "Yes" : "No"}</p>
      <div className="space-y-2 mt-2">
        <button
          onClick={() => setOpen(!isOpen)}
          className="block w-full bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Toggle Drawer
        </button>
        <button
          onClick={testAddItem}
          className="block w-full bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          Add Test Item
        </button>
      </div>
    </div>
  );
};

export default CartDebugComponent;
