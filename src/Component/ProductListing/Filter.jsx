// import React, { useCallback, useState } from "react";

import React, { useCallback, useState } from "react";

// export const Filter = React.memo(
//   ({ filterOptions, onFilterChange, activeFilters }) => {
//     const [expandedSections, setExpandedSections] = useState({
//       brands: true,
//       price: false,
//       category: false,
//       size: false,
//       color: false,
//       fabric: false,
//       discount: false,
//     });

//     const toggleSection = useCallback((section) => {
//       const isMobile = window.innerWidth < 1024; // lg breakpoint

//       setExpandedSections((prev) => {
//         if (isMobile) {
//           // 👉 Mobile: એક જ section open
//           const newState = Object.keys(prev).reduce((acc, key) => {
//             acc[key] = false;
//             return acc;
//           }, {});
//           newState[section] = !prev[section]; // clicked toggle
//           return newState;
//         } else {
//           // 👉 Desktop: multiple allow
//           return {
//             ...prev,
//             [section]: !prev[section],
//           };
//         }
//       });
//     }, []);

//     const handleFilterChange = useCallback(
//       (filterType, value, checked) => {
//         onFilterChange(filterType, value, checked);
//       },
//       [onFilterChange]
//     );

//     const FilterSection = ({ title, sectionKey, children }) => (
//       <div className="border-b border-gray-200 pb-4 mb-4">
//         <button
//           onClick={() => toggleSection(sectionKey)}
//           className="flex justify-between items-center w-full text-left font-medium text-gray-900 mb-3"
//         >
//           <span>{title}</span>
//           <svg
//             className={`w-4 h-4 transform transition-transform duration-200 ${
//               expandedSections[sectionKey] ? "rotate-180" : ""
//             }`}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M19 9l-7 7-7-7"
//             />
//           </svg>
//         </button>
//         {expandedSections[sectionKey] && (
//           <div className="space-y-2">{children}</div>
//         )}
//       </div>
//     );

//     const CheckboxFilter = ({ items, filterType, title }) => (
//       <FilterSection
//         title={title}
//         sectionKey={(filterType || "").toLowerCase().replace(/\s+/g, "")}
//       >
//         {items.map((item, index) => (
//           <label
//             key={index}
//             className="flex items-center space-x-2 cursor-pointer"
//           >
//             <input
//               type="checkbox"
//               className="filter-checkbox"
//               checked={activeFilters[filterType]?.includes(item) || false}
//               onChange={(e) =>
//                 handleFilterChange(filterType, item, e.target.checked)
//               }
//             />
//             <span className="text-sm text-gray-700">{item}</span>
//           </label>
//         ))}
//       </FilterSection>
//     );

//     const PriceRangeFilter = () => (
//       <FilterSection title="Price Range" sectionKey="price">
//         {filterOptions.priceRanges.map((range, index) => (
//           <label
//             key={index}
//             className="flex items-center space-x-2 cursor-pointer"
//           >
//             <input
//               type="checkbox"
//               className="filter-checkbox"
//               checked={activeFilters.priceRange?.includes(range.label) || false}
//               onChange={(e) =>
//                 handleFilterChange("priceRange", range.label, e.target.checked)
//               }
//             />
//             <span className="text-sm text-gray-700">{range.label}</span>
//           </label>
//         ))}
//       </FilterSection>
//     );

//     const DiscountFilter = () => (
//       <FilterSection title="Discount" sectionKey="discount">
//         {filterOptions.discounts.map((discount, index) => (
//           <label
//             key={index}
//             className="flex items-center space-x-2 cursor-pointer"
//           >
//             <input
//               type="checkbox"
//               className="filter-checkbox"
//               checked={
//                 activeFilters.discount?.includes(discount.label) || false
//               }
//               onChange={(e) =>
//                 handleFilterChange("discount", discount.label, e.target.checked)
//               }
//             />
//             <span className="text-sm text-gray-700">{discount.label}</span>
//           </label>
//         ))}
//       </FilterSection>
//     );

//     const clearAllFilters = useCallback(() => {
//       Object.entries(activeFilters).forEach(([filterType, values]) => {
//         values?.forEach((value) => {
//           handleFilterChange(filterType, value, false);
//         });
//       });
//     }, [activeFilters, handleFilterChange]);

//     const hasActiveFilters = Object.values(activeFilters).some(
//       (filter) => filter?.length > 0
//     );

//     return (
//       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
//           {hasActiveFilters && (
//             <button
//               onClick={clearAllFilters}
//               className="text-sm text-myntra-pink hover:text-pink-600 font-medium"
//             >
//               Clear All
//             </button>
//           )}
//         </div>
//         <div className="space-y-4">
//           <PriceRangeFilter />

//           <CheckboxFilter
//             items={filterOptions.brands}
//             filterType="brands"
//             title="Brand"
//           />

//           <CheckboxFilter
//             items={filterOptions.categories}
//             filterType="categories"
//             title="Category"
//           />

//           <CheckboxFilter
//             items={filterOptions.sizes}
//             filterType="sizes"
//             title="Size"
//           />

//           <CheckboxFilter
//             items={filterOptions.colors}
//             filterType="colors"
//             title="Color"
//           />

//           <CheckboxFilter
//             items={filterOptions.fabrics}
//             filterType="fabrics"
//             title="Fabric"
//           />

//           <DiscountFilter />
//         </div>
//         {/* Sort Options */}
//         <div className="mt-6 pt-4 border-t border-gray-200">
//           <h4 className="text-sm font-medium text-gray-900 mb-3">Sort By</h4>
//           <select
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-myntra-pink focus:border-transparent text-sm"
//             value={activeFilters.sortBy || "popularity"}
//             onChange={(e) => handleFilterChange("sortBy", e.target.value, true)}
//           >
//             <option value="popularity">Popularity</option>
//             <option value="price-low-to-high">Price: Low to High</option>
//             <option value="price-high-to-low">Price: High to Low</option>
//             <option value="newest-first">Newest First</option>
//             <option value="customer-rating">Customer Rating</option>
//             <option value="discount">Better Discount</option>
//           </select>
//         </div>
//         {/* <div className="mt-6 pt-4 lg:hidden  border-t border-gray-200">
//         <div className="mt-6 pt-4 lg:hidden border-t border-gray-200">
//           <button
//             onClick={() => onFilterChange("apply", activeFilters, true)}
//             className="w-full bg-[#C71F46] text-white py-2 rounded-md hover:bg-[#A51A3A] transition-colors font-medium"
//           >
//             Apply Filters
//           </button>
//         </div>
//       </div> */}
//         <div className="mt-6 pt-4 lg:hidden border-t border-gray-200">
//           <button
//             onClick={() => onFilterChange("apply", activeFilters, true)}
//             className="w-full bg-[#C71F46] text-white py-2 rounded-md hover:bg-[#A51A3A] transition-colors font-medium"
//           >
//             Apply Filters
//           </button>
//         </div>
//       </div>
//     );
//   }
// );

// export const Filter = React.memo(
//   ({ filterOptions, onFilterChange, activeFilters }) => {
//     const [expandedSections, setExpandedSections] = useState({});

//     const toggleSection = useCallback((sectionKey) => {
//       setExpandedSections((prev) => ({
//         ...prev,
//         [sectionKey]: !prev[sectionKey],
//       }));
//     }, []);

//     if (!filterOptions?.all_filters) return null;

//     return (
//       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

//         {filterOptions.all_filters.map((filter) => (
//           <div
//             key={filter.label_id}
//             className="border-b border-gray-200 pb-4 mb-4"
//           >
//             <button
//               onClick={() => toggleSection(filter.label_name)}
//               className="flex justify-between items-center w-full text-left font-medium text-gray-900 mb-3"
//             >
//               <span>{filter.label_name}</span>
//               <svg
//                 className={`w-4 h-4 transform transition-transform duration-200 ${
//                   expandedSections[filter.label_name] ? "rotate-180" : ""
//                 }`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>

//             {expandedSections[filter.label_name] && (
//               <div className="space-y-2">
//                 {filter.values.map((item) => (
//                   <label
//                     key={item.id}
//                     className="flex items-center space-x-2 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={
//                         activeFilters[filter.label_name]?.includes(item.id) ||
//                         false
//                       }
//                       onChange={() =>
//                         onFilterChange(filter.label_name, item.id)
//                       }
//                     />
//                     <span className="text-sm text-gray-700">{item.name}</span>
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   }
// );

export const Filter = React.memo(
  ({
    filterOptions,
    onFilterChange,
    activeFilters,
    filterLoading,
    onSortChange,
    currentSort = "relevance",
  }) => {
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = useCallback((sectionKey) => {
      setExpandedSections((prev) => ({
        ...prev,
        [sectionKey]: !prev[sectionKey],
      }));
    }, []);

    const clearAllFilters = useCallback(() => {
      Object.entries(activeFilters).forEach(([filterType, values]) => {
        values?.forEach((value) => onFilterChange(filterType, value));
      });
    }, [activeFilters, onFilterChange]);

    const handleSortChange = useCallback(
      (e) => {
        const selectedSort = e.target.value;
        if (onSortChange) {
          onSortChange(selectedSort);
        }
      },
      [onSortChange]
    );

    const hasActiveFilters = Object.values(activeFilters).some(
      (filter) => filter?.length > 0
    );

    if (!filterOptions?.all_filters) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      );
    }

    const sortOptions = filterOptions.sort_options || [];

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium disabled:opacity-50"
                disabled={filterLoading}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Loading Indicator */}
          {filterLoading && (
            <div className="flex items-center gap-2 mt-2 text-sm text-pink-600">
              <div className="w-3 h-3 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
              Applying filters...
            </div>
          )}
        </div>

        {/* Sort Section */}
        {sortOptions.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                />
              </svg>
              Sort By
            </h4>
            <select
              className="w-full px-3 py-2.5 border border-gray-300 "
              value={currentSort}
              onChange={handleSortChange}
              disabled={filterLoading}
            >
              {sortOptions.map((sortOption) => (
                <option key={sortOption.id} value={sortOption.code}>
                  {sortOption.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filter Sections */}
        <div className="p-6">
          <div className="space-y-6">
            {filterOptions.all_filters.map((filter) => (
              <div
                key={filter.label_id}
                className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0"
              >
                <button
                  onClick={() => toggleSection(filter.label_name)}
                  className="flex justify-between items-center w-full text-left font-medium text-gray-900 mb-3 group"
                  disabled={filterLoading}
                >
                  <span className="text-sm font-semibold text-gray-800">
                    {filter.label_name}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${
                      expandedSections[filter.label_name] ? "rotate-180" : ""
                    } group-hover:text-gray-600`}
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

                {expandedSections[filter.label_name] && (
                  <div className="space-y-2.5">
                    {filter.values.map((item) => {
                      const isChecked =
                        activeFilters[filter.label_name]?.includes(item.id) ||
                        false;
                      return (
                        <label
                          key={item.id}
                          className={`flex items-center space-x-3 cursor-pointer p-2  rounded-lg transition-colors ${
                            isChecked
                              ? "bg-blue-50 border "
                              : "hover:bg-gray-50"
                          } ${
                            filterLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600  "
                            checked={isChecked}
                            onChange={() =>
                              onFilterChange(filter.label_name, item.id)
                            }
                            disabled={filterLoading}
                          />
                          <span
                            className={`text-sm ${
                              isChecked ? "text-blue-700 " : "text-gray-700"
                            }`}
                          >
                            {item.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
