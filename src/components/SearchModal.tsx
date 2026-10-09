import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ArrowRight } from "lucide-react";
import { ROYAL_MENU_IMAGES } from "@/data/products";
import { ProductImage } from "./ProductImage";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? ROYAL_MENU_IMAGES.filter(
        (prod) =>
          prod.name.toLowerCase().includes(query.toLowerCase()) ||
          prod.alt.toLowerCase().includes(query.toLowerCase()) ||
          (prod.category && prod.category.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleSelectProduct = (productId: number) => {
    onClose();
    const el = document.getElementById(`product-card-${productId}`) || document.getElementById("menu");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#171614]/50 backdrop-blur-xs"
          />

          {/* Dialog */}
          <motion.div
            id="search-modal-dialog"
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 w-full max-w-xl bg-[#F7F4EE] rounded-2xl shadow-2xl border border-[#D8D0C3] overflow-hidden p-6"
          >
            {/* Input area */}
            <div className="flex items-center gap-3 border-b border-[#D8D0C3] pb-4">
              <Search className="w-5 h-5 text-[#6B1E2B]" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cakes, pastries, coffee, confections..."
                className="w-full bg-transparent text-[#171614] placeholder-[#171614]/40 text-base sm:text-lg focus:outline-none"
              />
              <button
                onClick={onClose}
                className="p-1 text-[#171614]/60 hover:text-[#6B1E2B] rounded-full cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results or Suggestions */}
            <div className="pt-4 max-h-72 overflow-y-auto">
              {query.trim() === "" ? (
                <div className="py-4 text-xs tracking-wider uppercase text-[#171614]/50 flex flex-wrap gap-2">
                  <span>Suggestions:</span>
                  {["Chocolate Cake", "Donut", "Cheesecake", "Coffee", "Cookies"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="underline hover:text-[#6B1E2B] cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              ) : filtered.length > 0 ? (
                <div className="space-y-2">
                  {filtered.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectProduct(item.id)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#EFE9DE] text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#EFE9DE] shrink-0 border border-[#D8D0C3]/60 p-0.5">
                          <ProductImage
                            product={item}
                            className="h-full w-full object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <span className="font-serif text-base font-medium text-[#171614] block">
                            {item.name}
                          </span>
                          <span className="text-xs text-[#171614]/60">
                            ₹{item.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#6B1E2B] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-[#171614]/60">
                  No confections found for "{query}"
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
