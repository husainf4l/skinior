"use client";

import React from "react";
import { useCartDrawer } from "@/lib/store/cart-store";
import CartDrawer from "../cart/CartDrawer";

const GlobalCartDrawer: React.FC = () => {
  const { isOpen, setOpen } = useCartDrawer();

  return <CartDrawer isOpen={isOpen} onClose={() => setOpen(false)} />;
};

export default GlobalCartDrawer;
