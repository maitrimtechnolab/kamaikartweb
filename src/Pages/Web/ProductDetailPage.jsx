import { useEffect, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

import { GetProductdatabyId } from "../../Redux/Features/ProductServicesSlice";
import { VariantInfo } from "../../Component/ProductDetail/VarientInfo";
import { ProductImages } from "../../Component/ProductDetail/ProductZoom";
import { AttributeSelector } from "../../Component/ProductDetail/AttributeSelector";
import {
  AddWishlist,
  RemoveWishlist,
} from "../../Redux/Features/WishlistServicesSlice";
import { AddTOCart } from "../../Redux/Features/CartServicesSlice";
import { BuyNow } from "../../Redux/Features/BuynowServicesSlice";
import toast from "react-hot-toast";
import { AuthModal } from "./AuthModal";
import {
  openAuthModal,
  closeAuthModal,
} from "../../Redux/Features/AuthenticationServicesSlice";

export const Product_Detail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.AuthOpration);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const {
    PersonalProductdata: product,
    loading,
    producterror,
  } = useSelector((state) => state.ProductOpration || {});

  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isWishlist, setIsWishlist] = useState(false);

  // Fetch product data
  useEffect(() => {
    if (id) dispatch(GetProductdatabyId({ id }));
  }, [dispatch, id]);

  // Initialize product state
  useEffect(() => {
    if (product) {
      setIsWishlist(product.is_wishlist || false);
      initializeSelections(product);
    }
  }, [product]);

  const initializeSelections = useCallback((productData) => {
    if (!productData?.variants?.[0]) return;

    const firstVariant = productData.variants[0];
    const initialSelections = {};

    firstVariant.attributes?.forEach((attr) => {
      if (attr.attribute_name && attr.value) {
        initialSelections[attr.attribute_name] = attr.value;
      }
    });

    setSelectedAttributes(initialSelections);
    setSelectedVariant(firstVariant);
  }, []);

  // Get all unique attribute types
  const attributeTypes = useMemo(() => {
    if (!product?.variants) return [];

    const types = new Set();
    product.variants.forEach((variant) => {
      variant.attributes?.forEach((attr) => {
        if (attr.attribute_name) types.add(attr.attribute_name);
      });
    });
    return Array.from(types);
  }, [product]);

  // Get available values for an attribute based on current selections
  const getAvailableValues = useCallback(
    (attributeName) => {
      if (!product?.variants) return [];

      let availableVariants = product.variants;

      // Filter based on other selected attributes
      Object.entries(selectedAttributes).forEach(([name, value]) => {
        if (name !== attributeName && value) {
          availableVariants = availableVariants.filter((variant) =>
            variant.attributes?.some(
              (attr) => attr.attribute_name === name && attr.value === value
            )
          );
        }
      });

      // Get unique values for requested attribute
      const values = new Set();
      availableVariants.forEach((variant) => {
        const attribute = variant.attributes?.find(
          (attr) => attr.attribute_name === attributeName
        );
        if (attribute?.value) values.add(attribute.value);
      });

      return Array.from(values);
    },
    [product, selectedAttributes]
  );

  // Handle attribute selection with dependency clearing
  const handleAttributeChange = useCallback(
    (attributeName, value) => {
      setSelectedAttributes((prev) => {
        const newSelections = {
          ...prev,
          [attributeName]: prev[attributeName] === value ? "" : value,
        };

        // Clear dependent attributes that become invalid
        attributeTypes.forEach((attrType) => {
          if (attrType !== attributeName && newSelections[attrType]) {
            const currentValue = newSelections[attrType];
            const availableValues = getAvailableValues(attrType);
            if (!availableValues.includes(currentValue)) {
              newSelections[attrType] = "";
            }
          }
        });

        return newSelections;
      });
    },
    [attributeTypes, getAvailableValues]
  );

  // Find matching variant based on selections
  useEffect(() => {
    if (!product?.variants) return;

    const hasSelections = Object.values(selectedAttributes).some(
      (value) => value !== ""
    );

    if (hasSelections) {
      const matchingVariant = product.variants.find((variant) =>
        Object.entries(selectedAttributes).every(([attrName, value]) => {
          if (!value) return true; // Skip empty selections
          return variant.attributes?.some(
            (attr) => attr.attribute_name === attrName && attr.value === value
          );
        })
      );
      setSelectedVariant(matchingVariant || null);
    } else {
      setSelectedVariant(product.variants[0] || null);
    }
  }, [selectedAttributes, product]);

  // Get current display variant
  const currentVariant = useMemo(
    () => selectedVariant || product?.variants?.[0] || null,
    [selectedVariant, product]
  );

  // Calculate discount
  const discount = useMemo(() => {
    if (!currentVariant?.price || !currentVariant?.selling_price) return 0;

    const price = parseFloat(currentVariant.price);
    const sellingPrice = parseFloat(currentVariant.selling_price);

    if (price <= 0 || sellingPrice >= price) return 0;

    return Math.round(((price - sellingPrice) / price) * 100);
  }, [currentVariant]);

  // ✅ FIXED: Always show ALL product images from gallery, ignore variant-specific images
  const displayImages = useMemo(() => {
    // Always return main product gallery images
    return product?.gallery || [product?.thumbnail].filter(Boolean);
  }, [product]); // Only depend on product, not currentVariant

  const canAddToCart = currentVariant && currentVariant.stock > 0;

  const requireAuth = useCallback(
    (callback) => {
      if (!isLoggedIn) {
        setIsAuthOpen(true);
        return false;
      }
      callback();
      return true;
    },
    [isLoggedIn] // <-- add this
  );

  // const handleAddToCart = useCallback(async () => {
  //   if (!canAddToCart) {
  //     alert("Please select an available variant");
  //     return;
  //   }

  //   try {
  //     await dispatch(
  //       AddTOCart({
  //         product_id: product.id,
  //         variant_id: selectedVariant?.id,
  //       })
  //     ).unwrap();
  //     toast.success("Item added to cart!");
  //   } catch (err) {
  //     toast.error(err || "Failed to add to cart");
  //   }

  //   // Add to cart logic here
  // });
  const handleAddToCart = useCallback(() => {
    requireAuth(async () => {
      if (!canAddToCart) {
        alert("Please select an available variant");
        return;
      }

      try {
        await dispatch(
          AddTOCart({
            product_id: product.id,
            variant_id: selectedVariant?.id,
          })
        ).unwrap();
        toast.success("Item added to cart!");
      } catch (err) {
        toast.error(err || "Failed to add to cart");
      }
    });
  }, [dispatch, requireAuth, product, selectedVariant, canAddToCart]);

  // const handleBuyNow = useCallback(async () => {
  //   // Navigate to checkout
  //   // if (!selectedVariant) {
  //   //   toast.error("Please select a variant first!");
  //   //   return;
  //   // }
  //   try {
  //     // const res = await dispatch(
  //     //   BuyNow({
  //     //     product_id: product.id,
  //     //     variant_id: selectedVariant.id,
  //     //   })
  //     // ).unwrap();
  //     //toast.success("Item added to cart!");

  //     // ✅ Pass full address object to checkout page
  //     navigate("/checkout", {
  //       state: {
  //         fromBuyNow: true,
  //         product: {
  //           product_id: product.id,
  //           variant_id: selectedVariant?.id,
  //           selling_price: selectedVariant.selling_price, // 💰 send selected price
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     toast.error("Something went wrong while buying the product.");
  //     console.error(error);
  //   }
  // });

  // const toggleWishlist = useCallback(async () => {
  //   try {
  //     if (!product?.id) return;

  //     if (!isWishlist) {
  //       // Add to wishlist
  //       await dispatch(AddWishlist({ product_id: product.id })).unwrap();
  //       setIsWishlist(true);
  //       console.log("✅ Added to wishlist");
  //     } else {
  //       // Remove from wishlist

  //       console.log(product.id);
  //       console.log(product);

  //       await dispatch(RemoveWishlist({ productid: product.id })).unwrap();
  //       setIsWishlist(false);
  //       console.log("❌ Removed from wishlist");
  //     }
  //   } catch (error) {
  //     console.error("Wishlist toggle failed:", error);
  //   }
  // }, [dispatch, isWishlist, product]);
  const handleBuyNow = useCallback(() => {
    requireAuth(() => {
      navigate("/checkout", {
        state: {
          fromBuyNow: true,
          product: {
            product_id: product.id,
            variant_id: selectedVariant?.id,
            selling_price: selectedVariant.selling_price,
          },
        },
      });
    });
  }, [navigate, requireAuth, product, selectedVariant]);

  const toggleWishlist = useCallback(() => {
    requireAuth(async () => {
      try {
        if (!product?.id) return;

        if (!isWishlist) {
          await dispatch(AddWishlist({ product_id: product.id })).unwrap();
          setIsWishlist(true);
          toast.success("Added to wishlist!");
        } else {
          await dispatch(RemoveWishlist({ productid: product.id })).unwrap();
          setIsWishlist(false);
          toast.info("Removed from wishlist!");
        }
      } catch (error) {
        console.error("Wishlist toggle failed:", error);
      }
    });
  }, [dispatch, requireAuth, product, isWishlist]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (producterror || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600">Sorry, we couldn't find the product.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Column - Product Images */}
            {/* ✅ Now shows ALL product images always */}
            <ProductImages images={displayImages} alt={product.name} />

            {/* Right Column - Product Information */}
            <div className="space-y-8">
              {/* Product Name */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                  <span className="text-sm font-bold text-blue-700">4.5</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${
                          star <= 4 ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  2.5K Ratings • 1.2K Reviews
                </span>
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹
                    {currentVariant?.selling_price ||
                      currentVariant?.price ||
                      "0"}
                  </span>
                  {discount > 0 && currentVariant?.price && (
                    <>
                      <span className="text-2xl text-gray-500 line-through">
                        ₹{currentVariant.price}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Inclusive of all taxes • Free shipping
                </p>
              </div>

              {/* Stock Information */}
              {currentVariant && (
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    currentVariant.stock > 10
                      ? "bg-green-100 text-green-800"
                      : currentVariant.stock > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentVariant.stock > 10
                    ? `${currentVariant.stock} in stock`
                    : currentVariant.stock > 0
                    ? `Only ${currentVariant.stock} left!`
                    : "Out of stock"}
                </div>
              )}

              {/* Attribute Selectors */}
              {attributeTypes.length > 0 ? (
                <div className="space-y-6">
                  {attributeTypes.map((attr) => (
                    <AttributeSelector
                      key={attr}
                      attributeName={attr}
                      product={product}
                      selectedAttributes={selectedAttributes}
                      onChange={handleAttributeChange}
                      getAvailableValues={getAvailableValues}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No variants available</div>
              )}

              {/* Selected Variant Information */}
              {currentVariant && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-700 font-semibold">
                    ✓ Variant Selected: {currentVariant.sku}
                  </p>
                  {currentVariant.attributes?.length > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      {currentVariant.attributes
                        .map((attr) => `${attr.attribute_name}: ${attr.value}`)
                        .join(" • ")}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons Section */}
              <VariantInfo
                product={product}
                currentVariant={currentVariant}
                discount={discount}
                canAddToCart={canAddToCart}
                isWishlist={isWishlist}
                toggleWishlist={toggleWishlist}
                handleAddToCart={handleAddToCart}
                handleBuyNow={handleBuyNow}
              />

              {/* Delivery & Returns Information */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm">🚚</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Free Delivery</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Order before 4PM for same day dispatch. Delivery in 2-4
                      business days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm">🛡️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Easy Returns & Exchange
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      30 Days return policy. No questions asked.
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Product Description
                </h3>
                <div
                  className="prose prose-sm text-gray-600 space-y-2"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      product.description || "No description available"
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={() => {
          setIsAuthOpen(false);
        }}
      />
    </div>
  );
};
