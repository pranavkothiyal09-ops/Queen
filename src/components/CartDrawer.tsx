import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, ArrowRight, Plus, Minus, Trash2 } from "lucide-react";
import { CartItem } from "@/types";
import { ProductImage } from "./ProductImage";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalItemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#171614]/40 backdrop-blur-xs"
          />

          {/* Drawer */}
          <motion.div
            id="cart-drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="relative z-10 w-full max-w-md bg-[#F7F4EE] h-full shadow-2xl flex flex-col justify-between border-l border-[#D8D0C3] p-6 sm:p-8"
          >
            {/* Top Area: Header + Items or Empty State */}
            <div className="flex flex-col flex-1 min-h-0">
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#D8D0C3] shrink-0">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-[#6B1E2B]" />
                  <h3 className="font-serif text-xl font-semibold text-[#171614]">
                    Your Royal Order
                  </h3>
                  {totalItemCount > 0 && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#6B1E2B]/10 text-[#6B1E2B]">
                      {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
                    </span>
                  )}
                </div>
                <button
                  id="close-cart-drawer-btn"
                  onClick={onClose}
                  className="p-1.5 text-[#171614]/70 hover:text-[#6B1E2B] rounded-full hover:bg-[#EFE9DE] transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              {items.length === 0 ? (
                /* Empty state */
                <div className="py-16 text-center flex flex-col items-center my-auto">
                  <div className="w-16 h-16 rounded-full bg-[#EFE9DE] flex items-center justify-center mb-4 text-[#6B1E2B]">
                    <ShoppingBag className="w-8 h-8 opacity-70" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#171614] mb-2">
                    Your cart is currently empty
                  </h4>
                  <p className="text-sm text-[#171614]/60 max-w-xs mb-6">
                    Explore our curated Royal Menu selections and prepare your bespoke delivery.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#171614] text-[#F7F4EE] hover:bg-[#6B1E2B] text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    <span>Explore Royal Menu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Cart Items List */
                <div className="flex-1 overflow-y-auto py-4 divide-y divide-[#D8D0C3]/60 pr-1">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      id={`cart-item-${product.id}`}
                      className="py-4 first:pt-2 last:pb-2 flex items-center gap-3.5"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-[#EFE9DE] border border-[#D8D0C3]/80 p-1">
                        <ProductImage
                          product={product}
                          className="h-full w-full object-cover object-center rounded-lg"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm sm:text-base font-semibold text-[#171614] truncate">
                          {product.name}
                        </h4>
                        <div className="text-xs text-[#171614]/60">
                          ₹{product.price.toLocaleString("en-IN")} each
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="inline-flex items-center rounded-lg bg-[#EFE9DE] border border-[#D8D0C3] p-0.5 text-[#171614]">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                              aria-label={`Decrease ${product.name}`}
                              className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#D8D0C3]/60 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(product.id, Math.min(10, quantity + 1))}
                              disabled={quantity >= 10}
                              aria-label={`Increase ${product.name}`}
                              className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#D8D0C3]/60 disabled:opacity-30 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(product.id)}
                            aria-label={`Remove ${product.name}`}
                            className="p-1 text-[#171614]/50 hover:text-[#6B1E2B] transition-colors rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Total Item Price */}
                      <div className="text-right shrink-0">
                        <span className="font-serif text-sm sm:text-base font-semibold text-[#171614]">
                          ₹{(product.price * quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Area: Order Summary & Checkout (if not empty) / Footer */}
            {items.length > 0 ? (
              <div className="pt-5 border-t border-[#D8D0C3] flex flex-col gap-3 shrink-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#171614]/70 font-medium">Subtotal</span>
                  <span className="font-serif text-lg font-semibold text-[#171614]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#171614]/50">
                  <span>Taxes & Royal Packaging</span>
                  <span>Calculated at checkout</span>
                </div>
                <button
                  type="button"
                  id="checkout-btn"
                  onClick={() => {
                    alert("Thank you for your Royal Order! Proceeding to bespoke checkout.");
                  }}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#6B1E2B] hover:bg-[#521721] text-[#F7F4EE] text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-[0_4px_16px_rgba(107,30,43,0.2)] active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center text-[11px] text-[#171614]/50">
                  Freshly baked & delivered directly to your door.
                </div>
              </div>
            ) : (
              <div className="pt-6 border-t border-[#D8D0C3] text-center text-xs text-[#171614]/50 shrink-0">
                Freshly baked & delivered directly to your door.
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
