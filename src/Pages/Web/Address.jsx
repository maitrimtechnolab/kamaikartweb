import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Trash2, Plus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../Layout/Layout";

import {
  getAllUserAddress,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
} from "../../Redux/Features/AddressServicesSlice";

const AddressPage = () => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector(
    (state) => state.UserAddressOpration
  );

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    area: "",
    flat: "",
    postal_code: "",
    address1: "",
    address2: "",
    address_tag: "HOME",
    default_address: false,
  });

  // Fetch addresses on mount
  useEffect(() => {
    dispatch(getAllUserAddress());
  }, [dispatch]);

  // Open modal for Add or Edit
  const openModal = (address = null) => {
    if (address) {
      setEditing(address.id);
      setForm(address);
    } else {
      setEditing(null);
      setForm({
        name: "",
        phone_number: "",
        area: "",
        flat: "",
        postal_code: "",
        address1: "",
        address2: "",
        address_tag: "HOME",
        default_address: false,
      });
    }
    setShowModal(true);
  };

  // Save Address (Add or Update)
  const saveAddress = async () => {
    if (!form.name || !form.phone_number || !form.address1) {
      toast.error("Name, Phone Number, and Address Line 1 are required!");
      return;
    }

    try {
      if (editing) {
        await dispatch(
          updateUserAddress({ id: editing, updateData: form })
        ).unwrap();
        toast.success("Address updated successfully");
      } else {
        await dispatch(addUserAddress(form)).unwrap();
        toast.success("Address added successfully");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  };

  // Delete Address
  const deleteAddress = async (id) => {
    try {
      await dispatch(deleteUserAddress(id)).unwrap();
      toast.error("Address removed");
    } catch (err) {
      toast.error(err || "Failed to delete");
    }
  };

  return (
    <>
      <div className=" space-y-6 bg-gray-50 min-h-screen">
        <Toaster position="top-right" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Addresses</h2>
          <button
            onClick={() => openModal()}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-700"
          >
            <Plus className="w-5 h-5" /> Add Address
          </button>
        </div>

        {/* Address List */}
        {loading ? (
          <p className="text-gray-500 text-center">Loading addresses...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : addresses.length === 0 ? (
          <p className="text-gray-500 text-center">No addresses added yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white border rounded-xl p-4 shadow-sm relative"
              >
                {addr.default_address && (
                  <span className="absolute top-2 right-2 bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
                    Default
                  </span>
                )}

                <h3 className="font-semibold text-gray-700">{addr.name}</h3>
                <p className="text-sm text-gray-500">{addr.phone_number}</p>
                <p className="text-sm text-gray-500">
                  {addr.flat}, {addr.area}
                </p>
                <p className="text-sm text-gray-500">{addr.address1}</p>
                <p className="text-sm text-gray-500">{addr.address2}</p>
                <p className="text-sm text-gray-500">
                  Postal Code: {addr.postal_code}
                </p>
                <p className="mt-1 text-xs font-medium text-pink-600">
                  {addr.address_tag}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => openModal(addr)}
                    className="flex-1 flex items-center justify-center border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="flex-1 flex items-center justify-center border border-red-300 text-red-500 rounded-lg py-2 text-sm hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editing ? "Edit Address" : "Add New Address"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Enter name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border rounded-lg p-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Enter phone_number *"
                  value={form.phone_number}
                  onChange={(e) =>
                    setForm({ ...form, phone_number: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Enter area"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="border rounded-lg p-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Enter flat no"
                  value={form.flat}
                  onChange={(e) => setForm({ ...form, flat: e.target.value })}
                  className="border rounded-lg p-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Enter postal code"
                  value={form.postal_code}
                  onChange={(e) =>
                    setForm({ ...form, postal_code: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Enter address 1 *"
                  value={form.address1}
                  onChange={(e) =>
                    setForm({ ...form, address1: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Enter address 2"
                  value={form.address2}
                  onChange={(e) =>
                    setForm({ ...form, address2: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                />
              </div>

              {/* Address address_tag */}
              <div className="mt-4 flex gap-3">
                {["HOME", "OFFICE", "OTHER"].map((address_tag) => (
                  <button
                    key={address_tag}
                    onClick={() => setForm({ ...form, address_tag })}
                    className={`px-4 py-2 rounded-full border ${
                      form.address_tag === address_tag
                        ? "bg-pink-600 text-white border-pink-600"
                        : "bg-white text-gray-600 border-gray-300"
                    }`}
                  >
                    {address_tag}
                  </button>
                ))}
              </div>

              {/* Default Checkbox */}
              <label className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={form.default_address}
                  onChange={(e) =>
                    setForm({ ...form, default_address: e.target.checked })
                  }
                />
                Make it default address
              </label>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAddress}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Save & Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddressPage;
