import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Wallet, Check, Shield, Lock, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { GetCartData } from "../../../Redux/Features/CartServicesSlice";
import { OrderPlace } from "../../../Redux/Features/OrderServicesSlice";
import { PaymentInfo } from "../../../Redux/Features/PaymentServicesSlice";
import {
  GetAllPromocodedata,
  ApplyPromoCode,
  ApplyPromoCodeWithBuyNow,
} from "../../../Redux/Features/PromoCodeServicesSlice";
import { BuyNow } from "../../../Redux/Features/BuynowServicesSlice";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get selected address from navigation state
  const selectedAddress = location.state?.selectedAddress;
  const buynow = location.state?.buyNowData;
  const fromBuyNow = location.state?.fromBuyNow;

  // Redux selectors
  const { total } = useSelector((state) => state.CartOpration);
  const { loading: orderLoading } = useSelector((state) => state.OrderOpration);
  const { PaymentData, PaymentLoading, PaymentError } = useSelector(
    (state) => state.PaymentOpration
  );

  // State variables
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayInstance, setRazorpayInstance] = useState(null); // Store razorpay instance

  const {
    Promocodeitem,
    Promocodeerror,
    Promocodeloading,
    appliedPromoResult,
  } = useSelector((state) => state.PromocodeOpration);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);

  useEffect(() => {
    dispatch(GetAllPromocodedata());
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetCartData());
    dispatch(PaymentInfo());
    loadRazorpay();
  }, [dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (razorpayInstance) {
        // Close any open razorpay modal
        razorpayInstance.close();
      }
    };
  }, [razorpayInstance]);

  // Filter active payment methods from API
  const activePaymentMethods =
    PaymentData?.filter((method) => method.is_active === true) || [];

  // Razorpay load karein
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        setRazorpayLoaded(true);
        resolve(true);
      };

      script.onerror = () => {
        setRazorpayLoaded(false);
        resolve(false);
        toast.error("Failed to load payment gateway");
      };

      document.body.appendChild(script);
    });
  };

  // -----------------------------
  // APPLY PROMO CODE
  // -----------------------------

  let res;
  const handleApplyPromo = async (promo) => {
    try {
      if (fromBuyNow) {
        res = await dispatch(
          ApplyPromoCodeWithBuyNow({
            product_id: buynow.product_id,
            variant_id: buynow.variant_id,
            promo_code_id: promo.id,
          })
        ).unwrap();
      } else {
        // For normal cart flow
        res = await dispatch(ApplyPromoCode(promo.id)).unwrap();
      }
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

  // Dynamic calculations
  //const safeTotal = Number(total || 0);
  const safeTotal = fromBuyNow
    ? Number(buynow?.selling_price || buynow?.price || 0)
    : Number(total || 0);
  const shipping = total > 50 ? 0 : 9.99;
  const tax = (safeTotal * 0.08).toFixed(2);
  //const total = subtotal + shipping + tax;
  let totalAmount = safeTotal;
  let discountAmount = 0;
  let finalTotal = (safeTotal + parseFloat(shipping) + parseFloat(tax)).toFixed(
    2
  );

  if (appliedPromo) {
    const promoData = appliedPromoResult || appliedPromo;
    totalAmount = promoData.total_amount || safeTotal;
    discountAmount = promoData.discount_amount || 0;
    finalTotal =
      promoData.final_amount ||
      promoData.total_amount ||
      safeTotal + shipping + tax;
  }
  //const fulltotal = ( safeTotal + parseFloat(shipping) + parseFloat(tax) ).toFixed(2);

  // Get payment method icon dynamically
  const getPaymentIcon = (methodName) => {
    const name = methodName.toLowerCase();
    if (name.includes("cash") || name.includes("cod")) {
      return <Wallet className="text-green-600" size={24} />;
    } else if (name.includes("razorpay") || name.includes("card")) {
      return <CreditCard className="text-blue-600" size={24} />;
    } else {
      return <CreditCard className="text-gray-600" size={24} />;
    }
  };

  // Get payment method background color dynamically
  const getPaymentBgColor = (methodName) => {
    const name = methodName.toLowerCase();
    if (name.includes("cash") || name.includes("cod")) {
      return "bg-green-100";
    } else if (name.includes("razorpay") || name.includes("card")) {
      return "bg-blue-100";
    } else {
      return "bg-gray-100";
    }
  };

  // Get payment method description
  const getPaymentDescription = (methodName) => {
    const name = methodName.toLowerCase();
    if (name.includes("cash") || name.includes("cod")) {
      return "Pay when you receive your order";
    } else if (name.includes("razorpay")) {
      return "Secure online payment via Razorpay";
    } else {
      return "Secure payment method";
    }
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  // Get selected payment method details
  const getSelectedMethod = () => {
    return activePaymentMethods.find(
      (method) => method.id === selectedPaymentMethod
    );
  };

  // Reset processing state - IMPORTANT FIX
  const resetProcessingState = () => {
    setIsProcessing(false);
    setRazorpayInstance(null);
  };

  // SIMPLE RAZORPAY INTEGRATION WITH PROPER CLOSE HANDLING
  const processRazorpayPayment = () => {
    if (!window.Razorpay) {
      toast.error("Payment gateway not loaded. Please refresh the page.");
      return;
    }

    setIsProcessing(true);

    try {
      const selectedMethod = getSelectedMethod();

      const options = {
        key: selectedMethod?.key_id,
        amount: Math.round(finalTotal * 100),
        // amount: Math.round(fulltotal * 100),
        currency: "INR",
        name: "KamaiKart",
        description: "Order Payment",
        image: selectedMethod?.image,
        // "https://www.kamaikart.in/api/uploads/icon/Razorpay-Logo.jpg",
        handler: function (response) {
          console.log("Payment Success:", response);
          toast.success("Payment Successful!");
          createOrderAfterPayment(response.razorpay_payment_id);
        },
        prefill: {
          name: selectedAddress?.name,
          contact: selectedAddress?.phone_number,
        },
        notes: {
          address: selectedAddress?.address1,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          // FIX: Handle modal close properly
          ondismiss: function () {
            console.log("Razorpay modal closed by user");
            resetProcessingState();
            toast.error("Payment cancelled by user");
          },
          escape: true, // Allow ESC key to close
          backdropclose: true, // Allow backdrop click to close
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      setRazorpayInstance(razorpayInstance);

      // Error handling
      razorpayInstance.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        toast.error(`Payment Failed: ${response.error.description}`);
        resetProcessingState();
      });

      // Additional event listeners for better handling
      razorpayInstance.on("close", function () {
        console.log("Razorpay modal closed");
        resetProcessingState();
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.error("Payment initialization failed");
      resetProcessingState();
    }
  };

  // Payment ke baad order create karein
  // const createOrderAfterPayment = async (paymentId) => {
  //   try {
  //     const selectedMethod = getSelectedMethod();

  //     const orderData = {
  //       payment_id: selectedMethod?.id,
  //       address_id: parseInt(selectedAddress.id),
  //       razorpay_payment_id: paymentId,
  //       // razorpay_payment_id: paymentId,
  //       // payment_status: "completed",
  //       // total_amount: fulltotal,
  //     };
  //     console.log(paymentId);

  //     const result = await dispatch(OrderPlace(orderData)).unwrap();

  //     if (result.status === "success") {
  //       toast.success("Order placed successfully!");
  //       navigate("/order-confirmation", {
  //         state: {
  //           orderData: result,
  //         },
  //       });
  //     } else {
  //       throw new Error(result.message || "Failed to create order");
  //     }
  //   } catch (error) {
  //     console.error("Order creation error:", error);
  //     toast.error("Order creation failed");
  //   } finally {
  //     resetProcessingState(); // Always reset processing state
  //   }
  // };

  // Cash on Delivery order create karein
  // const createCODOrder = async () => {
  //   try {
  //     const selectedMethod = getSelectedMethod();

  //     const orderData = {
  //       payment_id: selectedMethod?.id,
  //       address_id: parseInt(selectedAddress.id),
  //       // payment_method_id: selectedPaymentMethod,
  //       // payment_status: "pending",
  //       // total_amount: fulltotal,
  //     };

  //     const result = await dispatch(OrderPlace(orderData)).unwrap();

  //     if (result.status === "success") {
  //       toast.success("Order placed successfully!");
  //       navigate("/order-confirmation", {
  //         state: {
  //           orderData: result,
  //         },
  //       });
  //     } else {
  //       throw new Error(result.message || "Failed to create order");
  //     }
  //   } catch (error) {
  //     console.error("Order creation error:", error);
  //     toast.error(error.message || "Order creation failed");
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const createOrderAfterPayment = async (paymentId) => {
    try {
      const selectedMethod = getSelectedMethod();

      const orderData = {
        payment_id: selectedMethod?.id,
        address_id: parseInt(selectedAddress.id),
        razorpay_payment_id: paymentId,
        promo_code_id: appliedPromo.promo_code_id,
      };
      let result;

      if (fromBuyNow && buynow) {
        // 🔹 Call BuyNow API instead of OrderPlace
        result = await dispatch(
          BuyNow({
            product_id: buynow.product_id,
            variant_id: buynow.variant_id,
            address_id: parseInt(selectedAddress.id),
            payment_id: selectedMethod?.id,
            razor_payment_id: paymentId,
            promo_code_id: appliedPromo.promo_code_id,
          })
        ).unwrap();
      } else {
        // 🔹 Normal cart order flow
        result = await dispatch(OrderPlace(orderData)).unwrap();
      }

      if (result.status === "success") {
        toast.success("Order placed successfully!");
        navigate("/order-confirmation", {
          state: {
            orderData: result,
          },
        });
      } else {
        throw new Error(result.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("Order creation failed");
    } finally {
      resetProcessingState(); // Always reset processing state
    }
  };
  const createCODOrder = async () => {
    try {
      const selectedMethod = getSelectedMethod();
      let result;

      if (fromBuyNow && buynow) {
        // 🔹 Call BuyNow thunk
        result = await dispatch(
          BuyNow({
            product_id: buynow.product_id,
            variant_id: buynow.variant_id,
            address_id: parseInt(selectedAddress.id),
            payment_id: selectedMethod?.id,
            razor_payment_id: null,
          })
        ).unwrap();
      } else {
        // 🔹 Normal cart order

        const orderData = {
          payment_id: selectedMethod?.id,
          address_id: parseInt(selectedAddress.id),
          // payment_method_id: selectedPaymentMethod,
          // payment_status: "pending",
          // total_amount: fulltotal,
        };

        result = await dispatch(OrderPlace(orderData)).unwrap();
      }

      if (result.status === "success") {
        toast.success("Order placed successfully!");
        navigate("/order-confirmation", {
          state: {
            orderData: result,
          },
        });
      } else {
        throw new Error(result.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(error.message || "Order creation failed");
    } finally {
      setIsProcessing(false);
    }
  };
  // Handle place order - FIXED
  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    // Prevent multiple clicks
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    const selectedMethod = getSelectedMethod();

    if (!selectedMethod) {
      toast.error("Invalid payment method selected");
      setIsProcessing(false);
      return;
    }

    const methodName = selectedMethod.name.toLowerCase();

    if (methodName.includes("razorpay") || methodName.includes("card")) {
      // Small delay to ensure UI updates
      setTimeout(() => {
        processRazorpayPayment();
      }, 100);
    } else if (methodName.includes("cash") || methodName.includes("cod")) {
      await createCODOrder();
    } else {
      toast.error("Payment method not supported yet");
      setIsProcessing(false);
    }
  };

  // If no address selected, redirect to checkout
  if (!selectedAddress) {
    navigate("/checkout");
    return null;
  }

  // Show loading while fetching payment methods
  if (PaymentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment methods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Cancel Payment Button - Show only when processing */}
        {isProcessing && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-800">
                  Payment in progress...
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Methods Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600" />
                Select Payment Method
              </h2>

              {/* Dynamic Payment Methods from API */}
              <div className="space-y-4">
                {activePaymentMethods.length > 0 ? (
                  activePaymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPaymentMethod === method.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() =>
                        !isProcessing && handlePaymentMethodSelect(method.id)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 ${getPaymentBgColor(
                              method.name
                            )} rounded-lg flex items-center justify-center`}
                          >
                            {method.image ? (
                              <img
                                src={method.image}
                                alt={method.name}
                                className="w-8 h-8 object-contain"
                              />
                            ) : (
                              getPaymentIcon(method.name)
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {method.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {getPaymentDescription(method.name)}
                            </p>
                          </div>
                        </div>
                        {selectedPaymentMethod === method.id && (
                          <Check className="text-blue-600" size={20} />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      No payment methods available
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck size={20} className="text-green-600" />
                Delivery Address
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedAddress.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedAddress.flat}, {selectedAddress.area}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedAddress.address1}
                    </p>
                    {selectedAddress.address2 && (
                      <p className="text-sm text-gray-600">
                        {selectedAddress.address2}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      {selectedAddress.postal_code}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Phone: {selectedAddress.phone_number}
                    </p>
                  </div>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                    {selectedAddress.address_tag}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                    <span>Subtotal</span>
                    {/* <span>₹{safeTotal.toFixed(2)}</span> */}
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span>₹{tax}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span>Promo Discount</span>
                      <span>- ₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    {/* <span>₹{fulltotal}</span> */}
                    <span>₹{finalTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={
                    isProcessing ||
                    !selectedPaymentMethod ||
                    orderLoading ||
                    activePaymentMethods.length === 0
                  }
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : orderLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      {getSelectedMethod()?.name.toLowerCase().includes("cash")
                        ? "Place Order"
                        : "Pay Now"}
                    </>
                  )}
                </button>

                {selectedPaymentMethod && !isProcessing && (
                  <p className="text-center text-xs text-gray-500 mt-3">
                    {getSelectedMethod()?.name.toLowerCase().includes("cash")
                      ? "You'll pay when you receive your order"
                      : "You'll be redirected to secure payment"}
                  </p>
                )}
              </div>

              {/* Security Badge */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="text-green-600" size={12} />
                  </div>
                  Secure payment • SSL encrypted
                </div>
              </div>
              {showPromoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg w-96 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Select a Promo Code
                    </h3>

                    {/* Loading state */}
                    {Promocodeloading && (
                      <div className="text-center py-4 text-gray-500">
                        Loading...
                      </div>
                    )}

                    {/* Error state */}
                    {Promocodeerror && (
                      <div className="text-center text-red-500 py-4">
                        Failed to load promo codes.
                      </div>
                    )}

                    {/* Promo list */}
                    {!Promocodeloading &&
                    !Promocodeerror &&
                    Promocodeitem?.length > 0 ? (
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {Promocodeitem?.filter(
                          (promo) =>
                            promo.is_active === true &&
                            promo.is_deleted === false
                        )?.map((promo) => (
                          <div
                            key={promo.id}
                            className="border border-gray-200 rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 transition cursor-pointer"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {promo.code}
                              </p>
                              <p className="text-sm text-gray-600">
                                {promo.description}
                              </p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
