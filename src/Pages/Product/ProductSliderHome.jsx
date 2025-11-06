// import React, { useState, useRef, useEffect } from "react";
// import { ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";

// function ProductSliderHome({ Productdata }) {
//   const dispatch = useDispatch();
//   const scrollContainerRef = useRef(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);
//   const [wishlistItems, setWishlistItems] = useState([]);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   const checkScrollButtons = () => {
//     if (scrollContainerRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } =
//         scrollContainerRef.current;
//       const tolerance = 1; // Account for rounding errors

//       setCanScrollLeft(scrollLeft > tolerance);
//       setCanScrollRight(scrollLeft < scrollWidth - clientWidth - tolerance);
//     }
//   };

//   useEffect(() => {
//     checkScrollButtons();
//     window.addEventListener("resize", checkScrollButtons);

//     // Add scroll event listener
//     const scrollContainer = scrollContainerRef.current;
//     if (scrollContainer) {
//       scrollContainer.addEventListener("scroll", checkScrollButtons);
//     }

//     return () => {
//       window.removeEventListener("resize", checkScrollButtons);
//       if (scrollContainer) {
//         scrollContainer.removeEventListener("scroll", checkScrollButtons);
//       }
//     };
//   }, []);

//   // Re-check scroll buttons when data changes
//   useEffect(() => {
//     checkScrollButtons();
//   }, [Productdata]);

//   const scrollLeft = () => {
//     if (scrollContainerRef.current) {
//       const cardWidth = isMobile ? 160 : 250;
//       const gap = isMobile ? 12 : 24; // gap-3 = 12px, gap-6 = 24px
//       const scrollAmount = cardWidth + gap;

//       scrollContainerRef.current.scrollBy({
//         left: -scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };

//   const scrollRight = () => {
//     if (scrollContainerRef.current) {
//       const cardWidth = isMobile ? 160 : 250;
//       const gap = isMobile ? 12 : 24;
//       const scrollAmount = cardWidth + gap;

//       scrollContainerRef.current.scrollBy({
//         left: scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };

//   const toggleWishlist = (productId) => {
//     setWishlistItems((prev) =>
//       prev.includes(productId)
//         ? prev.filter((id) => id !== productId)
//         : [...prev, productId]
//     );
//   };

//   const ProductCard = ({ item }) => {
//     const isWishlisted = wishlistItems.includes(item.id);

//     return (
//       <div className={`${isMobile ? "w-[160px]" : "w-[250px]"} flex-shrink-0`}>
//         <div className="group relative bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full min-h-[320px] lg:min-h-[380px] transition-all duration-300">
//           {/* Image Container */}
//           <div
//             className={`relative ${
//               isMobile ? "h-32" : "h-48"
//             } w-full overflow-hidden  object-cover  flex-shrink-0 bg-gray-100`}
//           >
//             <Link to={`/${item.name}/${item.id}`}>
//               <img
//                 src={item.image ? item.image : "/1.jpg"}
//                 alt="product"
//                 className="w-full h-full object-cover"
//               />
//             </Link>

//             {/* Wishlist Button */}
//             <button
//               onClick={(e) => {
//                 //   e.preventDefault();
//                 e.stopPropagation();
//                 toggleWishlist(item.id);
//               }}
//               className={`absolute top-2 right-2 p-1.5 lg:p-2 rounded-full transition-all duration-300 ${
//                 isWishlisted
//                   ? "bg-red-500 text-white"
//                   : "bg-white bg-opacity-80 hover:bg-opacity-100"
//               }`}
//             >
//               <Heart
//                 size={isMobile ? 16 : 20}
//                 className={isWishlisted ? "fill-current" : ""}
//               />
//             </button>

//             {/* Discount Badge */}
//             {item.discount && (
//               <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
//                 {item.discount}% OFF
//               </div>
//             )}
//           </div>

//           {/* Content */}
//           <div className="p-3 lg:p-4 flex-1 flex flex-col justify-between">
//             <div>
//               <Link to={`/${item.name}/${item.id}`}>
//                 <h3
//                   className={`font-semibold text-gray-900 mb-2 line-clamp-2 ${
//                     isMobile ? "text-xs" : "text-sm"
//                   } group-hover:text-blue-600 leading-tight transition-colors`}
//                 >
//                   {item.name}
//                 </h3>
//               </Link>

//               {/* Rating */}
//               <div className="flex items-center gap-1 mb-2">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     size={isMobile ? 12 : 14}
//                     className={
//                       i < Math.floor(item.rating)
//                         ? "text-yellow-400 fill-yellow-400"
//                         : "text-gray-300"
//                     }
//                   />
//                 ))}
//                 <span
//                   className={`text-gray-500 ml-1 ${
//                     isMobile ? "text-xs" : "text-sm"
//                   }`}
//                 >
//                   ({item.reviews})
//                 </span>
//               </div>
//             </div>

//             {/* Price Section */}
//             <div className="mt-auto">
//               <div className="flex items-center gap-2 mb-1 flex-wrap">
//                 <span
//                   className={`font-bold text-gray-900 ${
//                     isMobile ? "text-base" : "text-lg"
//                   }`}
//                 >
//                   ${item.price.toLocaleString()}
//                 </span>
//                 {item.oldPrice && (
//                   <span
//                     className={`text-gray-400 line-through ${
//                       isMobile ? "text-xs" : "text-sm"
//                     }`}
//                   >
//                     ${item.oldPrice.toLocaleString()}
//                   </span>
//                 )}
//               </div>

//               {/* Sold Info */}
//               <div className="flex justify-between items-center">
//                 <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
//                   {item.sold} sold
//                 </span>
//                 {!isMobile && item.discount && (
//                   <span className="text-xs text-gray-500">
//                     Save {item.discount}%
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <section className="bg-gradient-to-br from-slate-50 to-blue-50/30">
//       <div className="container mx-auto px-2 lg:px-4">
//         {/* Products Slider Container */}
//         <div className="relative">
//           {/* Navigation Arrows - Only show if enough products */}
//           {Productdata.length > (isMobile ? 2 : 4) && (
//             <>
//               <button
//                 onClick={scrollLeft}
//                 disabled={!canScrollLeft}
//                 className={`absolute left-1 lg:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-2 lg:p-3 shadow-lg transition-all duration-300 ${
//                   canScrollLeft
//                     ? "hover:shadow-xl hover:scale-110 hover:bg-blue-50 cursor-pointer opacity-100"
//                     : "opacity-30 cursor-not-allowed"
//                 }`}
//               >
//                 <ChevronLeft
//                   size={isMobile ? 18 : 24}
//                   className="text-gray-700"
//                 />
//               </button>

//               <button
//                 onClick={scrollRight}
//                 disabled={!canScrollRight}
//                 className={`absolute right-1 lg:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-2 lg:p-3 shadow-lg transition-all duration-300 ${
//                   canScrollRight
//                     ? "hover:shadow-xl hover:scale-110 hover:bg-blue-50 cursor-pointer opacity-100"
//                     : "opacity-30 cursor-not-allowed"
//                 }`}
//               >
//                 <ChevronRight
//                   size={isMobile ? 18 : 24}
//                   className="text-gray-700"
//                 />
//               </button>
//             </>
//           )}

//           {/* Scrollable Products Container */}
//           <div
//             ref={scrollContainerRef}
//             onScroll={checkScrollButtons}
//             className="flex gap-3 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 lg:pb-6 scroll-smooth px-1"
//             style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//           >
//             {Productdata.map((product) => (
//               <ProductCard key={product.id} item={product} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
// export default React.memo(ProductSliderHome);

import React, { useState, useEffect } from "react";
import { Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  AddWishlist,
  RemoveWishlist,
  setWishlist,
} from "../../Redux/Features/WishlistServicesSlice";
import toast from "react-hot-toast";

export default function ProductSliderHome({ Productdata, sliderbox = 5 }) {
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.AuthOpration);

  const Wishlistitem = useSelector(
    (state) => state.WishlistOpration.Wishlistitem
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleWishlist = (productId, alreadyWishlisted) => {
    if (!isLoggedIn) {
      toast.error("Login required!");
      return;
    }

    if (Wishlistitem.includes(productId) || alreadyWishlisted) {
      // Optimistic remove
      toast.success("GO to Wishlist Page ");
    } else {
      // Optimistic add
      dispatch(setWishlist([...Wishlistitem, productId]));
      dispatch(AddWishlist({ product_id: productId }));
    }
  };

  const ProductCard = ({ item }) => {
    const isWishlisted = Wishlistitem.includes(item.id) || item.is_wishlist;
    return (
      <div className={`${isMobile ? "w-[160px]" : ""} mx-auto`}>
        <div className="group relative bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full min-h-[320px] lg:min-h-[380px] transition-all duration-300">
          {/* Image */}
          <div
            className={`relative ${
              isMobile ? "h-32" : "h-48"
            } w-full overflow-hidden bg-gray-100`}
          >
            <Link to={`/${item.name}/${item.id}`}>
              <img
                src={item.image ? item.image : "/1.jpg"}
                alt="product"
                className="w-full h-full object-cover"
              />
            </Link>

            {/* Wishlist */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(item.id, isWishlisted);
              }}
              className={`absolute top-2 right-2 p-1.5 lg:p-2 rounded-full transition-all duration-300 ${
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-white bg-opacity-80 hover:bg-opacity-100"
              }`}
            >
              <Heart
                size={isMobile ? 16 : 20}
                className={isWishlisted ? "" : ""}
              />
            </button>

            {/* Discount Badge */}
            {item.discount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {item.discount}% OFF
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 lg:p-4 flex-1 flex flex-col justify-between">
            <div>
              <Link to={`/${item.name}/${item.id}`}>
                <h3
                  className={`font-semibold text-gray-900 mb-2 line-clamp-2 ${
                    isMobile ? "text-xs" : "text-sm"
                  } group-hover:text-blue-600 leading-tight transition-colors`}
                >
                  {item.name}
                </h3>
              </Link>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={isMobile ? 12 : 14}
                    className={
                      i < Math.floor(item.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span
                  className={`text-gray-500 ml-1 ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}
                >
                  ({item.reviews})
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className={`font-bold text-gray-900 ${
                    isMobile ? "text-base" : "text-lg"
                  }`}
                >
                  ₹{item.price.toLocaleString()}
                </span>
                {item.oldPrice && (
                  <span
                    className={`text-gray-400 line-through ${
                      isMobile ? "text-xs" : "text-sm"
                    }`}
                  >
                    ₹{item.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                  {item.sold} sold
                </span>
                {!isMobile && item.discount && (
                  <span className="text-xs text-gray-500">
                    Save {item.discount}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50/30 py-4">
      <div className="container mx-auto px-2 lg:px-4">
        <Swiper
          modules={[Navigation]}
          navigation={isMobile ? false : true}
          spaceBetween={isMobile ? 12 : 24}
          slidesPerView={isMobile ? 2 : sliderbox}
          slidesPerGroup={1}
          loop={false}
          className="pb-6"
        >
          {Productdata.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard item={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
