import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, User, Menu, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
  onOpenAuth?: () => void;
  cartCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenSearch,
  onOpenAuth,
  cartCount = 0,
}) => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#F7F4EE]/90 backdrop-blur-md py-3.5 border-b border-[#D8D0C3]/60 shadow-[0_4px_24px_rgba(23,22,20,0.03)]"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Brand Mark / Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
          >
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#171614] group-hover:text-[#6B1E2B] transition-colors duration-300">
              Queen's Bakery
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav
            id="desktop-nav-links"
            className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide text-[#171614]/80"
          >
            <button
              id="nav-home-link"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-[#6B1E2B] transition-colors duration-200 cursor-pointer"
            >
              Home
            </button>
            <button
              id="nav-menu-link"
              onClick={() => scrollToSection("menu")}
              className="hover:text-[#6B1E2B] transition-colors duration-200 cursor-pointer"
            >
              Menu
            </button>
            <button
              id="nav-collections-link"
              onClick={() => scrollToSection("menu")}
              className="hover:text-[#6B1E2B] transition-colors duration-200 cursor-pointer"
            >
              Collections
            </button>
            <button
              id="nav-story-link"
              onClick={() => scrollToSection("our-story")}
              className="hover:text-[#6B1E2B] transition-colors duration-200 cursor-pointer"
            >
              Our Story
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              id="search-btn"
              onClick={onOpenSearch}
              className="p-2 text-[#171614] hover:text-[#6B1E2B] transition-colors duration-200 rounded-full hover:bg-[#EFE9DE]/60 focus:outline-none cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              id="account-btn"
              onClick={onOpenAuth}
              className="relative p-2 text-[#171614] hover:text-[#6B1E2B] transition-colors duration-200 rounded-full hover:bg-[#EFE9DE]/60 focus:outline-none cursor-pointer hidden sm:block"
              aria-label={user ? `Account (${user.email})` : "Account"}
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              {user && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6B1E2B] rounded-full ring-2 ring-[#F7F4EE]" />
              )}
            </button>

            <button
              id="cart-btn"
              onClick={onOpenCart}
              className="relative p-2 text-[#171614] hover:text-[#6B1E2B] transition-colors duration-200 rounded-full hover:bg-[#EFE9DE]/60 focus:outline-none cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-[#F7F4EE] bg-[#6B1E2B] rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#171614] hover:text-[#6B1E2B] transition-colors duration-200 rounded-full hover:bg-[#EFE9DE]/60 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#171614]/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              id="mobile-nav-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-[#F7F4EE] z-50 p-8 flex flex-col justify-between shadow-2xl border-l border-[#D8D0C3] md:hidden"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-[#D8D0C3]">
                  <span className="font-serif text-xl font-semibold text-[#171614]">
                    Queen's Bakery
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-[#171614] hover:text-[#6B1E2B] rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-5 text-lg font-medium text-[#171614]">
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setMobileMenuOpen(false);
                    }}
                    className="text-left hover:text-[#6B1E2B] transition-colors py-1"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => scrollToSection("menu")}
                    className="text-left hover:text-[#6B1E2B] transition-colors py-1"
                  >
                    Menu
                  </button>
                  <button
                    onClick={() => scrollToSection("menu")}
                    className="text-left hover:text-[#6B1E2B] transition-colors py-1"
                  >
                    Collections
                  </button>
                  <button
                    onClick={() => scrollToSection("our-story")}
                    className="text-left hover:text-[#6B1E2B] transition-colors py-1"
                  >
                    Our Story
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSearch?.();
                    }}
                    className="text-left hover:text-[#6B1E2B] transition-colors py-1 flex items-center justify-between"
                  >
                    <span>Search</span>
                    <Search className="w-4 h-4 opacity-60" />
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth?.();
                    }}
                    className="text-left hover:text-[#6B1E2B] transition-colors py-1 flex items-center justify-between"
                  >
                    <span>{user ? "My Account" : "Sign In / Register"}</span>
                    <User className="w-4 h-4 opacity-60" />
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenCart?.();
                    }}
                    className="text-left hover:text-[#6B1E2B] transition-colors py-1 flex items-center justify-between"
                  >
                    <span>Cart</span>
                    <ShoppingBag className="w-4 h-4 opacity-60" />
                  </button>
                </nav>
              </div>

              <div className="pt-6 border-t border-[#D8D0C3] text-xs text-[#171614]/60 tracking-wider">
                QUEEN'S BAKERY • HAUTE PÂTISSERIE
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
