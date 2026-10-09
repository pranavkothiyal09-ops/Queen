import React, { useState } from "react";
import { motion } from "motion/react";
import { Plus, Minus, Check, ShoppingBag } from "lucide-react";
import { ROYAL_MENU_IMAGES, ProductItem } from "@/data/products";
import { cn } from "@/lib/utils";
import { ProductImage } from "./ProductImage";

interface MenuCardProps {
  product: ProductItem;
  onAddToCart: (product: ProductItem, quantity: number) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(10, prev + 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    if (rawVal === "") {
      setQuantity(1);
      return;
    }
    const num = parseInt(rawVal, 10);
    if (isNaN(num)) {
      setQuantity(1);
    } else {
      setQuantity(Math.max(1, Math.min(10, num)));
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1600);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#181716] border border-[#2B2724] p-4 sm:p-5 transition-all duration-300 hover:border-[#6B1E2B]/60 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
    >
      {/* Top Media & Category */}
      <div>
        <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-[#131211] border border-[#24211E] mb-4 flex items-center justify-center p-3">
          <ProductImage
            product={product}
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 select-none"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-serif text-lg sm:text-xl font-medium text-[#F7F4EE] leading-snug tracking-tight">
              {product.name}
            </h3>
            <span className="font-serif text-base sm:text-lg font-semibold text-[#D8D0C3] shrink-0">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>
          {product.category && (
            <span className="text-[11px] font-medium tracking-wider uppercase text-[#F7F4EE]/40">
              {product.category}
            </span>
          )}
        </div>
      </div>

      {/* Action Controls: Quantity Selector + Add to Cart Button */}
      <div className="pt-3 border-t border-[#262320] flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          {/* Quantity Selector */}
          <div
            id={`quantity-selector-${product.id}`}
            className="inline-flex items-center rounded-xl bg-[#211F1D] border border-[#332E2A] p-1 text-[#F7F4EE]"
          >
            <button
              type="button"
              id={`qty-minus-${product.id}`}
              onClick={handleDecrease}
              disabled={quantity <= 1}
              aria-label={`Decrease quantity for ${product.name}`}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#2F2B27] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5 text-[#F7F4EE]/80" />
            </button>

            <input
              type="text"
              inputMode="numeric"
              id={`qty-input-${product.id}`}
              aria-label={`Quantity for ${product.name}`}
              value={quantity}
              onChange={handleInputChange}
              className="w-8 text-center bg-transparent text-xs font-semibold text-[#F7F4EE] focus:outline-none select-all"
            />

            <button
              type="button"
              id={`qty-plus-${product.id}`}
              onClick={handleIncrease}
              disabled={quantity >= 10}
              aria-label={`Increase quantity for ${product.name}`}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#2F2B27] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#F7F4EE]/80" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAddToCart}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl text-xs font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer select-none",
              isAdded
                ? "bg-[#6B1E2B] text-[#F7F4EE] border border-[#852535]"
                : "bg-[#F7F4EE] text-[#171614] hover:bg-[#EFE9DE] border border-transparent active:scale-[0.98]"
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#171614]/70" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface MenuCatalogSectionProps {
  onAddToCart: (product: ProductItem, quantity: number) => void;
}

export const MenuCatalogSection: React.FC<MenuCatalogSectionProps> = ({
  onAddToCart,
}) => {
  return (
    <section
      id="menu"
      className="relative w-full bg-[#121212] text-[#F7F4EE] py-20 sm:py-28 md:py-32 px-4 sm:px-8 lg:px-12 border-t border-[#23201D]"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-3xl mb-12 sm:mb-16">
          <motion.h2
            id="royal-menu-catalog-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#F7F4EE] leading-tight mb-3"
          >
            Royal Menu
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-xs sm:text-sm md:text-base text-[#D8D0C3]/70 font-light tracking-wide max-w-xl mx-auto"
          >
            Handcrafted daily using heirloom recipes and single-origin ingredients.
          </motion.p>
        </div>

        {/* Product Grid: 4 cards per row on Desktop, 2 on Tablet, 1 on Mobile */}
        <div
          id="royal-menu-products-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 w-full"
        >
          {ROYAL_MENU_IMAGES.map((product) => (
            <MenuCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
