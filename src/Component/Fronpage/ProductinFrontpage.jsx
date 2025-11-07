// import { useState, useEffect, useMemo, useCallback } from "react";
import { Filter } from "../../Component/ProductListing/Filter";
// import { filterOptions } from "../../data/mockData";
// import { FaFilter, FaTimes } from "react-icons/fa";
import { ProductCard } from "../ProductListing/ProductCard";
// import { useDispatch, useSelector } from "react-redux";
import {
  GetAllProductdata,
  resetProducts,
} from "../../Redux/Features/ProductServicesSlice";
import {
  AfterFilterAppliedFilterData,
  HomepageFilterData,
} from "../../Redux/Features/FilterServicesSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFilter, FaTimes } from "react-icons/fa";

// export const ProductListing = () => {
//   const dispatch = useDispatch();

//   const { Products, productloadings, producterror, limit, page, total } =
//     useSelector((state) => state.ProductOpration);

//   const [activeFilters, setActiveFilters] = useState({
//     brands: [],
//     categories: [],
//     sizes: [],
//     colors: [],
//     fabrics: [],
//     priceRange: [],
//     discount: [],
//     sortBy: "popularity",
//   });

//   useEffect(() => {
//     dispatch(resetProducts());

//     dispatch(GetAllProductdata());
//     console.log("hiii");
//   }, [dispatch]);

//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);

//   // Filter and sort products based on active filters
//   const filteredAndSortedProducts = useMemo(() => {
//     if (!Products) return [];

//     let filteredProducts = [...Products];

//     // Apply brand filter
//     if (activeFilters.brands.length > 0) {
//       filteredProducts = filteredProducts.filter((product) =>
//         activeFilters.brands.includes(product.brand)
//       );
//     }

//     // Apply category filter
//     if (activeFilters.categories.length > 0) {
//       filteredProducts = filteredProducts.filter((product) =>
//         activeFilters.categories.includes(product.category)
//       );
//     }

//     // Apply size filter
//     if (activeFilters.sizes.length > 0) {
//       filteredProducts = filteredProducts.filter((product) =>
//         product.sizes.some((size) => activeFilters.sizes.includes(size))
//       );
//     }

//     // Apply color filter
//     if (activeFilters.colors.length > 0) {
//       filteredProducts = filteredProducts.filter((product) =>
//         product.colors.some((color) => activeFilters.colors.includes(color))
//       );
//     }

//     // Apply fabric filter
//     if (activeFilters.fabrics.length > 0) {
//       filteredProducts = filteredProducts.filter((product) =>
//         activeFilters.fabrics.includes(product.fabric)
//       );
//     }

//     // Apply price range filter
//     if (activeFilters.priceRange.length > 0) {
//       filteredProducts = filteredProducts.filter((product) => {
//         return activeFilters.priceRange.some((rangeLabel) => {
//           const range = filterOptions.priceRanges.find(
//             (r) => r.label === rangeLabel
//           );
//           return (
//             range && product.price >= range.min && product.price <= range.max
//           );
//         });
//       });
//     }

//     // Apply discount filter
//     if (activeFilters.discount.length > 0) {
//       filteredProducts = filteredProducts.filter((product) => {
//         return activeFilters.discount.some((discountLabel) => {
//           const discount = filterOptions.discounts.find(
//             (d) => d.label === discountLabel
//           );
//           return discount && product.discount >= discount.min;
//         });
//       });
//     }

//     // Apply sorting
//     switch (activeFilters.sortBy) {
//       case "price-low-to-high":
//         filteredProducts.sort((a, b) => a.price - b.price);
//         break;
//       case "price-high-to-low":
//         filteredProducts.sort((a, b) => b.price - a.price);
//         break;
//       case "newest-first":
//         filteredProducts.sort((a, b) => b.id - a.id);
//         break;
//       case "customer-rating":
//         filteredProducts.sort((a, b) => b.rating - a.rating);
//         break;
//       case "discount":
//         filteredProducts.sort((a, b) => b.discount - a.discount);
//         break;
//       default:
//         filteredProducts.sort((a, b) => b.reviews - a.reviews);
//         break;
//     }

//     return filteredProducts;
//   }, [Products, activeFilters]);

//   // // Calculate current products to display
//   const currentProducts = useMemo(() => {
//     return filteredAndSortedProducts; // Already limited by API
//   }, [filteredAndSortedProducts]);

//   // Check if there are more products to load
//   useEffect(() => {
//     setHasMore(Products.length < total);
//   }, [Products, total]);

//   useEffect(() => {
//     if (showMobileFilters) {
//       // Disable background scrolling
//       document.body.style.overflow = "hidden";
//     } else {
//       // Restore scrolling
//       document.body.style.overflow = "";
//     }

//     // Cleanup when component unmounts
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [showMobileFilters]);

//   // Handle filter changes
//   const handleFilterChange = useCallback((filterType, value, checked) => {
//     if (filterType === "apply") {
//       setShowMobileFilters(false);
//       return;
//     }

//     setActiveFilters((prev) => {
//       const newFilters = { ...prev };

//       if (!newFilters[filterType]) {
//         newFilters[filterType] = [];
//       }

//       if (checked) {
//         newFilters[filterType] = [...newFilters[filterType], value];
//       } else {
//         newFilters[filterType] = newFilters[filterType].filter(
//           (item) => item !== value
//         );
//       }

//       return newFilters;
//     });
//   }, []);

//   console.log(Products);

//   // Load more products function
//   const loadMoreProducts = useCallback(() => {
//     if (productloadings || !hasMore) return;

//     dispatch(GetAllProductdata({ page, limit }));
//   }, [dispatch, productloadings, hasMore, page, limit]);

//   // Infinite scroll handler
//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop >=
//         document.documentElement.offsetHeight - 100
//       ) {
//         loadMoreProducts();
//       }
//     };

//     // Add throttle to scroll handler
//     const throttledScroll = throttle(handleScroll, 100);
//     window.addEventListener("scroll", throttledScroll);
//     return () => window.removeEventListener("scroll", throttledScroll);
//   }, [loadMoreProducts]);

//   // Manual load more button handler
//   const handleLoadMore = () => {
//     loadMoreProducts();
//   };

//   const throttle = (func, limit) => {
//     let inThrottle;
//     return function (...args) {
//       if (!inThrottle) {
//         func.apply(this, args);
//         inThrottle = true;
//         setTimeout(() => (inThrottle = false), limit);
//       }
//     };
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
//       <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
//         {/* Mobile Filter Button */}
//         <div className="lg:hidden mb-4">
//           <button
//             onClick={() => setShowMobileFilters(!showMobileFilters)}
//             className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 flex items-center justify-between shadow-sm"
//           >
//             <span className="font-medium">Filters & Sort</span>
//             <FaFilter className="text-gray-500" />
//           </button>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Filters Sidebar */}

//           <aside className="hidden lg:block w-80 flex-shrink-0">
//             <Filter
//               filterOptions={filterOptions}
//               onFilterChange={handleFilterChange}
//               activeFilters={activeFilters}
//             />
//           </aside>
//           {showMobileFilters && (
//             <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden">
//               {/* Backdrop */}
//               <div
//                 className="absolute inset-0 bg-black bg-opacity-40"
//                 onClick={() => setShowMobileFilters(false)}
//               />

//               {/* Filter Panel */}
//               <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end md:hidden">
//                 <div className="bg-white rounded-t-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
//                   {/* Header */}
//                   <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
//                     <h3 className="text-xl font-semibold text-gray-900">
//                       Filters
//                     </h3>
//                     <button
//                       onClick={() => setShowMobileFilters(false)}
//                       className="p-2"
//                     >
//                       <FaTimes className="text-gray-500" />
//                     </button>
//                   </div>

//                   <div className="flex-1 overflow-y-auto">
//                     <div className="p-6">
//                       <Filter
//                         filterOptions={filterOptions}
//                         onFilterChange={handleFilterChange}
//                         activeFilters={activeFilters}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Main Content */}
//           <div className="flex-1">
//             {/* Results Info */}
//             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
//               <p className="text-sm text-gray-600">
//                 Showing {total} of {filteredAndSortedProducts.length} products
//               </p>
//             </div>

//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//               {productloadings && Products.length === 0 && (
//                 <p className="col-span-2 lg:col-span-4 text-center text-gray-600">
//                   Loading products...
//                 </p>
//               )}

//               {producterror && Products.length === 0 && (
//                 <p className="col-span-2 lg:col-span-4 text-center text-red-500">
//                   Failed to load products. Please try again.
//                 </p>
//               )}

//               {currentProducts.length === 0 &&
//                 !productloadings &&
//                 !producterror && (
//                   <p className="col-span-2 lg:col-span-4 text-center text-gray-500">
//                     No products found.
//                   </p>
//                 )}

//               {currentProducts.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>

//             {/* Load More Button */}
//             {hasMore && (
//               <div className="flex justify-center mt-8">
//                 <div
//                   onClick={handleLoadMore}
//                   disabled={loading}
//                   className={`px-6 py-3  text-black rounded-md font-medium
//                     `}
//                 >
//                   {loading
//                     ? "Fetching More......"
//                     : "Fetching More Products........"}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

export const ProductListing = () => {
  const dispatch = useDispatch();
  const [selectedFilters, setSelectedFilters] = useState({});
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState("relevance"); // Sort state

  const { Products, productloadings, limit, page, total } = useSelector(
    (state) => state.ProductOpration
  );
  const { HomePageFilterAPIdata, FilterLoading } = useSelector(
    (state) => state.FilterOpration
  );

  // ✅ 1️⃣ Load filters + products on mount
  useEffect(() => {
    dispatch(HomepageFilterData());
    dispatch(resetProducts());
    dispatch(GetAllProductdata());
  }, [dispatch]);

  // ✅ 2️⃣ Update selected filters (for UI only)
  const handleFilterChange = useCallback((labelName, valueId) => {
    setSelectedFilters((prev) => {
      const current = prev[labelName] || [];
      const exists = current.includes(valueId);
      const updated = exists
        ? current.filter((id) => id !== valueId)
        : [...current, valueId];

      const newFilters = { ...prev };
      if (updated.length) newFilters[labelName] = updated;
      else delete newFilters[labelName];
      return newFilters;
    });
  }, []);

  // ✅ 3️⃣ Separate function for category filter changes
  const handleCategoryFilterChange = useCallback(
    (labelName, valueId) => {
      const isCategoryFilter =
        labelName.toLowerCase().includes("category") ||
        labelName.toLowerCase().includes("categories");

      if (isCategoryFilter) {
        setCategoryFilters((prev) => {
          const exists = prev.includes(valueId);
          const updated = exists
            ? prev.filter((id) => id !== valueId)
            : [...prev, valueId];

          // Prepare payload with sort
          let payload = {};
          if (updated.length > 0) {
            payload = {
              category_ids: updated,
              ...(sortBy !== "relevance" && { sort_by: sortBy }),
            };
          } else if (sortBy !== "relevance") {
            payload = { sort_by: sortBy };
          }

          console.log("📤 Sending to API:", payload);
          dispatch(AfterFilterAppliedFilterData(payload));

          return updated;
        });
      }

      // For non-category filters, just update UI state
      handleFilterChange(labelName, valueId);
    },
    [dispatch, handleFilterChange, sortBy]
  );

  // ✅ 4️⃣ Handle sort change
  const handleSortChange = useCallback(
    (selectedSort) => {
      setSortBy(selectedSort);

      const currentCategoryFilters = categoryFilters;
      let payload = {};

      if (currentCategoryFilters.length > 0) {
        payload = {
          category_ids: currentCategoryFilters,
          ...(selectedSort !== "relevance" && { sort_by: selectedSort }),
        };
      } else if (selectedSort !== "relevance") {
        payload = { sort_by: selectedSort };
      }

      console.log("🔄 Sorting products:", payload);
      if (Object.keys(payload).length > 0) {
        dispatch(AfterFilterAppliedFilterData(payload));
      }
    },
    [categoryFilters, dispatch]
  );

  // ✅ 5️⃣ Clear all filters
  const handleClearAllFilters = useCallback(() => {
    console.log("🗑️ Clearing all filters");
    setSelectedFilters({});
    setCategoryFilters([]);
    setSortBy("relevance");
    dispatch(resetProducts());
    dispatch(GetAllProductdata());
  }, [dispatch]);

  // ✅ 6️⃣ Load more products
  const loadMoreProducts = useCallback(() => {
    if (productloadings || !hasMore) return;
    dispatch(GetAllProductdata({ page, limit }));
  }, [dispatch, productloadings, hasMore, page, limit]);

  useEffect(() => {
    setHasMore(Products.length < total);
  }, [Products, total]);

  // ✅ Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMoreProducts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreProducts]);

  const hasActiveFilters =
    Object.values(selectedFilters).some((arr) => arr.length > 0) ||
    categoryFilters.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">
              {Products.length} of {total} products
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mt-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500" />
                <span className="font-medium text-gray-700">
                  Filters & Sort
                </span>
                {hasActiveFilters && (
                  <span className="bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {Object.values(selectedFilters).flat().length +
                      categoryFilters.length}
                  </span>
                )}
              </div>
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filter */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <Filter
              filterOptions={HomePageFilterAPIdata}
              onFilterChange={handleCategoryFilterChange}
              activeFilters={{ ...selectedFilters, Category: categoryFilters }}
              filterLoading={FilterLoading}
              onSortChange={handleSortChange}
              currentSort={sortBy}
            />
          </aside>

          {/* Mobile Filter Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setShowMobileFilters(false)}
              />
              <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl">
                <div className="flex flex-col h-full">
                  <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-white">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Filters & Sort
                    </h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FaTimes className="text-gray-500 text-lg" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <Filter
                      filterOptions={HomePageFilterAPIdata}
                      onFilterChange={handleCategoryFilterChange}
                      activeFilters={{
                        ...selectedFilters,
                        Category: categoryFilters,
                      }}
                      filterLoading={FilterLoading}
                      onSortChange={handleSortChange}
                      currentSort={sortBy}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {/* Products Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {Products.length === 0 && !productloadings && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0A6 6 0 014 10z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters to find what you're looking for.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAllFilters}
                    className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMoreProducts}
                  disabled={productloadings}
                  className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  {productloadings ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    "Load More Products"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
