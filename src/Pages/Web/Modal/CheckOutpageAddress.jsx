import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Plus, Edit3, Check } from "lucide-react";
import NewAddressModal from "./NewAddressModal";
import toast from "react-hot-toast";
import { getAllUserAddress } from "../../../Redux/Features/AddressServicesSlice";
import { GetCartData } from "../../../Redux/Features/CartServicesSlice";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const buyNowData = location.state?.product || null;
  const fromBuyNow = location.state?.fromBuyNow || false;

  // Redux selectors
  const { total: cartTotal } = useSelector((state) => state.CartOpration);
  const total = fromBuyNow
    ? Number(buyNowData?.selling_price || buyNowData?.price || 0)
    : Number(cartTotal || 0);

  const { addresses, loading, error } = useSelector(
    (state) => state.UserAddressOpration
  );

  // Local state
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [hasCheckedAddresses, setHasCheckedAddresses] = useState(false);

  // Load addresses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch addresses from API
        const addressesResult = await dispatch(getAllUserAddress()).unwrap();

        // 2️⃣ Fetch cart data
        await dispatch(GetCartData()).unwrap();

        // 3️⃣ Auto-select logic
        if (addressesResult.length > 0) {
          const defaultAddr = addressesResult.find(
            (addr) => addr.default_address
          );
          setSelectedAddress(
            defaultAddr ? defaultAddr.id : addressesResult[0].id
          );
        } else {
          // 4️⃣ No addresses → open modal
          setShowNewAddressModal(true);
        }
      } catch (err) {
        console.error("Error fetching checkout data:", err);
      }
    };

    fetchData();
  }, [dispatch]);

  // Auto-select when addresses change (e.g., after adding new address)
  useEffect(() => {
    if (addresses?.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find((addr) => addr.default_address);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else {
        setSelectedAddress(addresses[0].id);
      }
    }
  }, [addresses, selectedAddress]);

  // Reset the check when component unmounts
  useEffect(() => {
    return () => {
      setHasCheckedAddresses(false);
    };
  }, []);

  const safeTotal = Number(total || 0);

  const shipping = total > 50 ? 0 : 9.99;
  const tax = total * 0.08;

  const fulltotal = safeTotal + tax + shipping;

  // Address handlers
  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
    const selectedAddr = addresses.find((addr) => addr.id === addressId);
    toast.success(`Address selected: ${selectedAddr.name}`);
  };

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    const selectedAddressData = addresses.find(
      (addr) => addr.id === selectedAddress
    );

    navigate("/payment", {
      state: {
        selectedAddress: selectedAddressData,
        fromBuyNow,
        buyNowData,
      },
    });
  };

  // Show loading state while checking addresses
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin size={20} className="text-blue-600" />
                  Delivery Address
                </h2>
                <button
                  onClick={() => setShowNewAddressModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Add New Address
                </button>
              </div>

              {/* Address List */}
              <div className="space-y-4">
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddress === address.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleAddressSelect(address.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {address.name}
                            </h3>
                            {address.default_address && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                Default
                              </span>
                            )}
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                              {address.address_tag}
                            </span>
                            {selectedAddress === address.id && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                Selected
                              </span>
                            )}
                          </div>

                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              {address.flat}, {address.area}
                            </p>
                            <p>{address.address1}</p>
                            {address.address2 && <p>{address.address2}</p>}
                            <p>Postal Code: {address.postal_code}</p>
                            <p className="font-medium mt-2">
                              Phone: {address.phone_number}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {selectedAddress === address.id && (
                            <Check className="text-blue-600" size={20} />
                          )}

                          <div className="flex flex-col gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingAddress(address);
                                setShowNewAddressModal(true);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit address"
                            >
                              <Edit3 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No address saved
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add your first delivery address to continue with checkout
                    </p>
                    <button
                      onClick={() => setShowNewAddressModal(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add New Address
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Address Confirmation */}
            {selectedAddress && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Check className="text-green-600" size={20} />
                  <div>
                    <p className="text-green-800 font-medium">
                      Delivery address selected
                    </p>
                    <p className="text-green-700 text-sm">
                      Your order will be delivered to the selected address
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* {fromBuyNow && buyNowData && (
            <div className="flex items-center gap-4 mb-4 border-b pb-4">
              <img
                src={buyNowData.thumbnail}
                alt={buyNowData.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{buyNowData.name}</p>
                <p className="text-sm text-gray-600">Qty: {buyNowData.quantity}</p>
                <p className="text-blue-600 font-bold mt-1">
                  ₹{buyNowData.selling_price || buyNowData.price}
                </p>
              </div>
            </div>
          )} */}

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₹{tax}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{fulltotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  disabled={!selectedAddress}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                </button>

                <p className="text-center text-sm text-gray-600 mt-3">
                  You won't be charged until you complete payment
                </p>
              </div>

              {/* Security Badge */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="text-green-600" size={12} />
                  </div>
                  Secure checkout • SSL encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Address Modal */}
      {showNewAddressModal && (
        <NewAddressModal
          addressToEdit={editingAddress}
          onClose={() => {
            setShowNewAddressModal(false);
            setEditingAddress(null);
          }}
        />
      )}
    </div>
  );
}
