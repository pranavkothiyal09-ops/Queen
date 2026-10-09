/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import ReactLenis from "lenis/react";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { WelcomeSection } from "./components/WelcomeSection";
import { RoyalMenuSection } from "./components/RoyalMenuSection";
import { CartSection } from "./components/CartSection";
import { OurStorySection } from "./components/OurStorySection";
import { MenuCatalogSection } from "./components/MenuCatalogSection";
import { CartDrawer } from "./components/CartDrawer";
import { SearchModal } from "./components/SearchModal";
import { AuthModal } from "./components/AuthModal";
import { CartItem, ProductItem } from "./types";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (product: ProductItem, quantity: number) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQuantity = Math.min(10, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQuantity,
        };
        return updated;
      } else {
        return [...prev, { product, quantity: Math.min(10, Math.max(1, quantity)) }];
      }
    });
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(10, newQuantity) }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <AuthProvider>
      <ReactLenis root>
        <div className="relative min-h-screen bg-[#F7F4EE] text-[#171614] selection:bg-[#6B1E2B] selection:text-[#F7F4EE] font-sans">
          {/* 1. Sticky / Fixed Header Navbar */}
          <Navbar
            onOpenCart={() => setIsCartOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            cartCount={totalCartCount}
          />

          {/* Main Content Flow */}
          <main className="w-full">
            {/* 1. Hero Section 1: Welcome Section with Skiper31 V1 Character Animation */}
            <WelcomeSection />

            {/* 2. Hero Section 2: Royal Menu Introduction Section with 9-image Dock */}
            <RoyalMenuSection />

            {/* 3. Hero Section 3: Cart / Ordering Section with Skiper67 Video Player */}
            <CartSection />

            {/* 4. The Royal Menu E-Commerce Catalog Section */}
            <MenuCatalogSection onAddToCart={handleAddToCart} />

            {/* 5. Our Story Section with Skiper34 7-Image Scroll Reveal */}
            <OurStorySection />
          </main>

          {/* Footer */}
          <footer className="w-full bg-[#0D0D0D] text-[#D8D0C3] py-14 px-6 sm:px-10 lg:px-16 border-t border-[#1F1C1A]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <span className="font-serif text-2xl font-semibold text-[#F7F4EE] tracking-tight">
                  Queen's Bakery
                </span>
                <p className="text-xs text-[#D8D0C3]/60 mt-1 max-w-sm">
                  Bespoke pastries, handcrafted viennoiserie, and royal confectionary since 1892.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#D8D0C3]/70">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hover:text-[#F7F4EE] transition-colors cursor-pointer"
                >
                  Back to top
                </button>
                <button
                  onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
                  className="hover:text-[#F7F4EE] transition-colors cursor-pointer"
                >
                  Royal Menu
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="hover:text-[#F7F4EE] transition-colors cursor-pointer"
                >
                  Your Order ({totalCartCount})
                </button>
              </div>
              <div className="text-[11px] text-[#D8D0C3]/40">
                © {new Date().getFullYear()} Queen's Bakery. All rights reserved.
              </div>
            </div>
          </footer>

          {/* Overlays & Drawers */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
          <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
      </ReactLenis>
    </AuthProvider>
  );
}
