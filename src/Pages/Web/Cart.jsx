import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Heart,
  Truck,
  Sparkles,
} from "lucide-react";
import {
  AddTOCart,
  DeleteTOCart,
  GetCartData,
  UpdateQuentity,
} from "../../Redux/Features/CartServicesSlice";
import toast from "react-hot-toast";
import { AddWishlist } from "../../Redux/Features/WishlistServicesSlice";
import { GetAllPromocodedata, ApplyPromoCode } from "../../Redux/Features/PromoCodeServicesSlice";

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { CartData, CartLoading, CartError } = useSelector(
    (state) => state.CartOpration
  );

  const { Promocodeitem, Promocodeerror, Promocodeloading, appliedPromoResult } = useSelector(
    (state) => state.PromocodeOpration
  );

  // Local state for loading states
  const [updatingItems, setUpdatingItems] = useState({});
  const [removingItems, setRemovingItems] = useState({});
  const [localCartData, setLocalCartData] = useState([]);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);

  useEffect(() => {
  dispatch(GetAllPromocodedata());
}, [dispatch]);
  
  // Sync local cart data with Redux state
  useEffect(() => {
    if (CartData && CartData.length > 0) {
      setLocalCartData(CartData);
    }
  }, [CartData]);

  // Fetch cart on mount
  useEffect(() => {
    dispatch(GetCartData());
  }, [dispatch]);

  // Update quantity with optimistic UI
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    // Optimistic UI update - immediately update local state
    const updatedCartData = localCartData.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setLocalCartData(updatedCartData);

    // Set loading state for this specific item
    setUpdatingItems((prev) => ({ ...prev, [id]: true }));

    try {
      await dispatch(
        UpdateQuentity({ product_id: id, quantity: newQuantity })
      ).unwrap();
      toast.success("Quantity updated successfully!");
      // ✅ Recalculate promo if applied
      if (appliedPromo) {
        await dispatch(ApplyPromoCode( appliedPromo.promo_code_id || appliedPromo.id )).unwrap();
      }
      // Optionally refresh cart again
      await dispatch(GetCartData());


    } catch (error) {
      // Revert optimistic update if API call fails
      setLocalCartData(CartData);
      toast.error("Failed to update quantity");
      console.error("Update quantity error:", error);
    } finally {
      // Clear loading state
      setUpdatingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Remove item with optimistic UI
  const removeItem = async (id) => {
    // Optimistic UI update - immediately remove from local state
    const updatedCartData = localCartData.filter((item) => item.id !== id);
    setLocalCartData(updatedCartData);

    // Set loading state for this specific item
    setRemovingItems((prev) => ({ ...prev, [id]: true }));

    try {
      await dispatch(DeleteTOCart(id)).unwrap();
      toast.success("Item removed from cart");
    } catch (error) {
      // Revert optimistic update if API call fails
      setLocalCartData(CartData);
      toast.error("Failed to remove item");
      console.error("Remove item error:", error);
    } finally {
      // Clear loading state
      setRemovingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Move to wishlist
  const moveToWishlist = async (item) => {
    const itemId = item.id;

    // Set loading state for this specific item
    setRemovingItems((prev) => ({ ...prev, [itemId]: true }));

    try {
      // 1️⃣ Add to wishlist
      await dispatch(AddWishlist({ product_id: item.id })).unwrap();

      // 2️⃣ Remove from cart (optimistic update)
      const updatedCartData = localCartData.filter(
        (cartItem) => cartItem.id !== itemId
      );
      setLocalCartData(updatedCartData);

      await dispatch(DeleteTOCart(itemId)).unwrap();

      toast.success("Moved to wishlist successfully!");
    } catch (error) {
      // Revert optimistic update if API call fails
      setLocalCartData(CartData);
      toast.error(error.message || "Failed to move item to wishlist.");
    } finally {
      // Clear loading state
      setRemovingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  // -----------------------------
  // APPLY PROMO CODE
  // -----------------------------
  const handleApplyPromo = async (promo) => {
    try {
      const res = await dispatch(ApplyPromoCode(promo.id)).unwrap();
      if (res?.status) {
        setAppliedPromo(res.data);
        toast.success(`${res.data.promo_code} applied successfully!`);
        setShowPromoModal(false);
      } else {
        toast.error("Invalid or expired promo code");
      }
    } catch (error) {
      toast.error("Failed to apply promo code");
      console.error(error);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast.success("Promo code removed");
  };

  // Calculate totals based on local cart data for real-time updates
  const subtotal = localCartData.reduce(
    (sum, item) => sum + (item.sellingPrice || 0) * (item.quantity || 0),
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;

  
  //const total = subtotal + shipping + tax;
  let totalAmount = subtotal;
  let discountAmount = 0;
  let finalTotal = subtotal + shipping + tax;

  if (appliedPromo) {
    const promoData = appliedPromoResult || appliedPromo;
    totalAmount = promoData.total_amount || subtotal;
    discountAmount = promoData.discount_amount || 0;
    finalTotal = promoData.final_amount || promoData.total_amount || subtotal + shipping + tax;
  }

  const totalSavings = localCartData.reduce(
    (sum, item) =>
      sum +
      ((item.originalPrice || 0) - (item.sellingPrice || 0)) *
        (item.quantity || 0),
    0
  );

  if (CartLoading && localCartData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (CartError && localCartData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading cart: {CartError}
      </div>
    );
  }

  const handleProceedToCheckout = () => {
    if (localCartData.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {localCartData.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-gray-400" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start
              shopping to discover amazing products!
            </p>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Sparkles size={20} /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                {localCartData.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 ${
                      updatingItems[item.id] || removingItems[item.id]
                        ? "opacity-60"
                        : ""
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {item.name}
                            </h3>
                            <div className="space-y-1 mb-3 text-sm text-gray-600">
                              {item.color && <p>Color: {item.color}</p>}
                              {item.size && <p>Size: {item.size}</p>}
                              {item.brand && <p>Brand: {item.brand}</p>}
                              {item.fabric && <p>Fabric: {item.fabric}</p>}
                              {item.pattern && <p>Pattern: {item.pattern}</p>}
                              {item.category && (
                                <p>Category: {item.category}</p>
                              )}
                              {item.gender && <p>Gender: {item.gender}</p>}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
                              <Truck size={16} />
                              <span>{item.delivery}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-bold text-gray-900">
                                ₹
                                {(
                                  (item.sellingPrice || 0) *
                                  (item.quantity || 0)
                                ).toLocaleString()}
                              </span>
                              {item.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                  ₹
                                  {(
                                    (item.originalPrice || 0) *
                                    (item.quantity || 0)
                                  ).toLocaleString()}
                                </span>
                              )}
                            </div>
                            {item.originalPrice && (
                              <span className="text-xs text-green-600 font-medium">
                                Save ₹
                                {(
                                  (item.originalPrice - item.sellingPrice) *
                                  item.quantity
                                ).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={
                                updatingItems[item.id] || removingItems[item.id]
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus size={16} />
                            </button>

                            <div className="relative">
                              <span
                                className={`w-8 text-center font-medium ${
                                  updatingItems[item.id] ? "text-blue-600" : ""
                                }`}
                              >
                                {item.quantity}
                              </span>
                              {updatingItems[item.id] && (
                                <div className="absolute -top-1 -right-1">
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={
                                updatingItems[item.id] || removingItems[item.id]
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => moveToWishlist(item)}
                              disabled={removingItems[item.id]}
                              className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Heart size={16} />
                              <span>
                                {removingItems[item.id] ? "Moving..." : "Save"}
                              </span>
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              disabled={removingItems[item.id]}
                              className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={16} />
                              <span>
                                {removingItems[item.id]
                                  ? "Removing..."
                                  : "Remove"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Promo Code</span>
                      <div className="flex items-center gap-2">
                        {appliedPromo ? (
                          <>
                            <span className="text-green-600 font-medium">
                              {appliedPromo.promo_code}
                            </span>
                            <button
                              onClick={handleRemovePromo}
                              className="text-red-500 text-sm hover:underline"
                            >
                              Remove
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setShowPromoModal(true)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                   
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({localCartData.length} items)</span>
                      
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-green-600" : ""}>
                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-blue-600">
                        <span>Promo Discount</span>
                        <span>- ₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Total Savings</span>
                        <span>- ₹{totalSavings.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={
                      Object.keys(updatingItems).some(
                        (key) => updatingItems[key]
                      ) ||
                      Object.keys(removingItems).some(
                        (key) => removingItems[key]
                      )
                    }
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105 mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {Object.keys(updatingItems).some(
                      (key) => updatingItems[key]
                    ) ||
                    Object.keys(removingItems).some((key) => removingItems[key])
                      ? "Updating..."
                      : "Proceed to Checkout"}
                  </button>
                  <p className="text-center text-sm text-gray-600">
                    You won't be charged yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showPromoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-96 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select a Promo Code
          </h3>

          {/* Loading state */}
          {Promocodeloading && (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          )}

          {/* Error state */}
          {Promocodeerror && (
            <div className="text-center text-red-500 py-4">
              Failed to load promo codes.
            </div>
          )}

          {/* Promo list */}
          {!Promocodeloading && !Promocodeerror && Promocodeitem?.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {Promocodeitem?.filter((promo) => promo.is_active === true && promo.is_deleted === false)?.map((promo) => (
                <div
                  key={promo.id}
                  className="border border-gray-200 rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 transition cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-900">{promo.code}</p>
                    <p className="text-sm text-gray-600">{promo.description}</p>
                  </div>
                  <button
                    onClick={() => handleApplyPromo(promo)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          ) : (
            !Promocodeloading &&
            !Promocodeerror && (
              <div className="text-center text-gray-500 py-4">
                No promo codes available
              </div>
            )
          )}

          {/* Cancel button */}
          <button
            onClick={() => setShowPromoModal(false)}
            className="w-full mt-5 text-center text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
