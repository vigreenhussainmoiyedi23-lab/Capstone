import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  X,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/redux/hook";
import { Logo } from "./Logo";
import CartSideMenu from "../features/cart/components/CartSideMenu";
import { GetProductsAPI } from "../features/products/service/api.service";

// ─── Types ────────────────────────────────────────────────────────────────────


// ─── Navbar Component ─────────────────────────────────────────────────────────
const Navbar = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const enums = useAppSelector((state) => state.product.enums);

  // ── Cart sidebar state
  const [cartOpen, setCartOpen] = useState(false);

  // ── Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // ── Mega-menu state
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const menuTimeoutRef = useRef<ReturnType(null);

  // ── Cart item count
  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  // ── Fetch search suggestions with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timeout = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const result = await GetProductsAPI({ search: searchQuery, limit: 6 });
        const products = result?.products ?? result ?? [];
        setSuggestions(Array.isArray(products) ? products : []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // ── Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Handle Enter key in search
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // ── Navigate to suggestion
  const handleSuggestionClick = (slug) => {
    setShowSuggestions(false);
    setSearchQuery("");
    navigate(`/product/${slug}`);
  };

  // ── Subcategories for hovered category
  const getSubcategories = (category) =>
    enums.subCategories
      .filter((s) => s.category === category)
      .map((s) => s.name);

  // ── Mega-menu hover helpers (with delay to prevent flicker)
  const handleCatEnter = (cat) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setHoveredCategory(cat);
  };
  const handleCatLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150);
  };
  const handleMenuEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
  };
  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150);
  };

  // ── Navigate to subcategory
  const handleSubCategoryClick = (category, subCategory) => {
    setHoveredCategory(null);
    navigate(
      `/products?cat=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(subCategory)}`
    );
  };

  // ── Navigate to category (all)
  const handleCategoryClick = (category) => {
    setHoveredCategory(null);
    navigate(`/products?cat=${encodeURIComponent(category)}`);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          MAIN NAVBAR
      ═══════════════════════════════════════════════════════ */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full bg-[#111111] border-b border-white/5 shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
      >
        <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 lg:px-8 h-[68px]">

          {/* ── Logo ──────────────────────────────────────────── */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <Logo size={"2.4"} />
            <span className="text-xl font-black tracking-[0.22em] uppercase text-[#f7880d] group-hover:text-[#ff9a1a] transition-colors duration-200 hidden sm:block">
              Snitch
            </span>
          </button>

          {/* ── Search Bar ────────────────────────────────────── */}
          <div className="flex-1 max-w-2xl mx-auto relative" ref={searchRef}>
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/85 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search products, brands, categories..."
                className="w-full pl-10 pr-10 py-2.5 bg-[#FDFBF7]/90 border border-[#FDFBF7]/10 rounded-xl text-sm text-black placeholder-black/70 outline-none focus:border-[#f7880d]/60 focus:bg-[#FDFBF7]/95 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setSuggestions([]); setShowSuggestions(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/70 hover:text-black/70 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* ── Suggestions Dropdown ──────────────────────── */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  {searchLoading ? (
                    <div className="px-4 py-6 text-center text-white/40 text-sm">
                      <div className="w-5 h-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                      Searching...
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="px-4 py-5 text-center text-white/40 text-sm">
                      No products found for "{searchQuery}"
                    </div>
                  ) : (
                    <>
                      <div className="px-3 py-2 border-b border-white/5">
                        <p className="text-xs text-white/30 font-medium uppercase tracking-wider">
                          Products
                        </p>
                      </div>
                      <ul className="py-1">
                        {suggestions.map((product) => (
                          <li key={product._id}>
                            <button
                              onClick={() => handleSuggestionClick(product.slug)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors group text-left"
                            >
                              {/* Thumbnail */}
                              <div className="w-11 h-11 rounded-lg bg-white/5 border border-white/8 overflow-hidden shrink-0 flex items-center justify-center">
                                {product.images?.[0] || product.images[0].url ? (
                                  <img
                                    src={product.images?.[0].url}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Search className="w-4 h-4 text-white/20" />
                                )}
                              </div>
                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white/80 group-hover:text-white truncate transition-colors font-medium">
                                  {product.title}
                                </p>
                                <p className="text-xs text-primary font-semibold mt-0.5">
                                  ₹{product.finalPrice?.toLocaleString("en-IN")}
                                </p>
                              </div>
                              <ChevronDown className="w-3.5 h-3.5 text-white/20 -rotate-90 group-hover:text-white/50 shrink-0 transition-colors" />
                            </button>
                          </li>
                        ))}
                      </ul>
                      {/* View all results */}
                      <div className="border-t border-white/5 p-2">
                        <button
                          onClick={() => {
                            setShowSuggestions(false);
                            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                          }}
                          className="w-full text-center text-xs text-primary hover:text-[#ff9a1a] py-2 font-semibold transition-colors"
                        >
                          View all results for "{searchQuery}" →
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right Side ────────────────────────────────────── */}
          <div className="flex items-center gap-1 shrink-0">
            {user ? (
              <>
                {/* Admin Dashboard */}
                {user.role === "admin" && (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/admin")}
                    title="Dashboard"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-primary border border-primary/25 hover:bg-primary/10 transition-all duration-200"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin</span>
                  </motion.button>
                )}

                {/* Account */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => navigate("/myaccount")}
                  title="My Account"
                  className="relative p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => navigate("/wishlist")}
                  title="Wishlist"
                  className="relative p-2.5 rounded-xl text-white/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>

                {/* Cart */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setCartOpen(true)}
                  title="Cart"
                  className="relative p-2.5 rounded-xl text-white/60 hover:text-[#f7880d] hover:bg-[#f7880d]/10 transition-all duration-200"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#f7880d] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all duration-200"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#f7880d] hover:bg-[#ff9a1a] shadow-[0_0_12px_rgba(247,136,13,0.25)] transition-all duration-200"
                >
                  Register
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════════════════════
          SUB-NAVBAR — Categories & Mega Menu
          NOTE: The mega-menu is rendered OUTSIDE the overflow-x-auto
          tabs div to avoid being clipped by it.
      ═══════════════════════════════════════════════════════ */}
      {enums.categories.length > 0 && (
        <div className="sticky top-[68px] z-40 w-full bg-[#1a1a1a] border-b border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
          <div className="relative mx-auto max-w-7xl px-4 lg:px-8">

            {/* ── Category Tabs (scrollable) ── */}
            <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {enums.categories.map((category) => {
                const subs = getSubcategories(category);
                const isHovered = hoveredCategory === category;
                return (
                  <button
                    key={category}
                    onMouseEnter={() => handleCatEnter(category)}
                    onMouseLeave={handleCatLeave}
                    onClick={() => handleCategoryClick(category)}
                    className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap shrink-0 ${isHovered
                      ? "text-[#f7880d] border-[#f7880d]"
                      : "text-white/55 border-transparent hover:text-white/90 hover:border-white/20"
                      }`}
                  >
                    {category}
                    {subs.length > 0 && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isHovered ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Mega Menu Dropdown — sibling of tabs, never clipped ── */}
            <AnimatePresence>
              {hoveredCategory && getSubcategories(hoveredCategory).length > 0 && (
                <motion.div
                  key={hoveredCategory}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  onMouseEnter={handleMenuEnter}
                  onMouseLeave={handleMenuLeave}
                  className="absolute top-full left-0 mt-0 min-w-[280px] bg-[#1c1c1c] border border-white/10 border-t-0 rounded-b-xl shadow-2xl z-50 overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/35">
                      {hoveredCategory}
                    </p>
                    <button
                      onClick={() => handleCategoryClick(hoveredCategory)}
                      className="text-xs text-[#f7880d] hover:text-[#ff9a1a] font-medium transition-colors"
                    >
                      View all →
                    </button>
                  </div>

                  {/* Subcategory Grid */}
                  <div className="p-3 grid grid-cols-2 gap-1.5">
                    {getSubcategories(hoveredCategory).map((sub) => (
                      <button
                        key={sub}
                        onClick={() => handleSubCategoryClick(hoveredCategory, sub)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/6 border border-transparent hover:border-white/10 transition-all duration-150 text-left group"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#f7880d]/50 group-hover:bg-[#f7880d] transition-colors shrink-0" />
                        {sub}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      )}

      {/* ── Cart Sidebar ──────────────────────────────────────── */}
      <CartSideMenu isOpen={cartOpen} setIsOpen={setCartOpen} />
    </>
  );
};

export default Navbar;
