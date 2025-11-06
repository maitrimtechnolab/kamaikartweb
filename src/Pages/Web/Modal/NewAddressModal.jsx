// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addUserAddress,
//   updateUserAddress,
// } from "../../../Redux/Features/AddressServicesSlice"; // ✅ adjust path
// import toast from "react-hot-toast";

// const NewAddressModal = ({ onClose, addressToEdit }) => {
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.UserAddressOpration);

//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     if (addressToEdit) {
//       setFormData({
//         name: addressToEdit.name || "",
//         phone_number: addressToEdit.phone_number || "",
//         area: addressToEdit.area || "",
//         flat: addressToEdit.flat || "",
//         postal_code: addressToEdit.postal_code || "",
//         address1: addressToEdit.address1 || "",
//         address2: addressToEdit.address2 || "",
//         address_tag: addressToEdit.address_tag || "HOME",
//         default_address: addressToEdit.default_address || false,
//       });
//     } else {
//       // Clear form for new address
//       setFormData({
//         name: "",
//         phone_number: "",
//         area: "",
//         flat: "",
//         postal_code: "",
//         address1: "",
//         address2: "",
//         address_tag: "HOME",
//         default_address: false,
//       });
//     }
//   }, [addressToEdit]);
//   const [errors, setErrors] = useState({});
//   const [submitError, setSubmitError] = useState("");

//   // -------------------------
//   // Handle Input Change
//   // -------------------------
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   // -------------------------
//   // Validation
//   // -------------------------
//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "The name field is required";
//     if (!formData.phone_number.trim())
//       newErrors.phone_number = "The phone field is required";
//     if (!formData.address1.trim())
//       newErrors.address1 = "The address line field is required";
//     return newErrors;
//   };

//   // -------------------------
//   // Handle Submit
//   // -------------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     setErrors(validationErrors);
//     if (Object.keys(validationErrors).length > 0) return;

//     try {
//       if (addressToEdit) {
//         // ✏️ Edit address
//         console.log("id", addressToEdit.id);
//         console.log("a", formData);

//         await dispatch(
//           updateUserAddress({ id: addressToEdit.id, updateData: formData })
//         ).unwrap();
//         toast.success("Address updated successfully!");
//       } else {
//         // ➕ Add address
//         await dispatch(addUserAddress(formData)).unwrap();
//         toast.success("Address added successfully!");
//       }

//       // refresh address list
//       onClose();
//     } catch (err) {
//       console.error("Error:", err);
//       toast.error("Operation failed");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-[800px] p-6 relative">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
//         >
//           &times;
//         </button>
//         <h2 className="text-xl font-semibold mb-4">
//           {addressToEdit ? "Edit Address" : "New Address"}
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name & Phone */}
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="block text-sm mb-1">Name *</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={`w-full border rounded px-3 py-2 ${
//                   errors.name ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter name"
//               />
//               {errors.name && (
//                 <p className="text-xs text-red-500 mt-1">{errors.name}</p>
//               )}
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm mb-1">Phone *</label>
//               <input
//                 type="text"
//                 name="phone_number"
//                 value={formData.phone_number}
//                 onChange={handleChange}
//                 className={`w-full border rounded px-3 py-2 ${
//                   errors.phone_number ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter phone"
//               />
//               {errors.phone_number && (
//                 <p className="text-xs text-red-500 mt-1">
//                   {errors.phone_number}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Area, Flat, Postal Code */}
//           <div className="flex gap-4">
//             <input
//               type="text"
//               name="area"
//               value={formData.area}
//               onChange={handleChange}
//               placeholder="Enter Area"
//               className="flex-1 border rounded px-3 py-2 border-gray-300"
//             />
//             <input
//               type="text"
//               name="flat"
//               value={formData.flat}
//               onChange={handleChange}
//               placeholder="Enter Flat no"
//               className="flex-1 border rounded px-3 py-2 border-gray-300"
//             />
//             <input
//               type="text"
//               name="postal_code"
//               value={formData.postal_code}
//               onChange={handleChange}
//               placeholder="Enter Postal Code"
//               className="flex-1 border rounded px-3 py-2 border-gray-300"
//             />
//           </div>

//           {/* Address Line 1 & 2 */}
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="block text-sm mb-1">Address Line 1 *</label>
//               <input
//                 type="text"
//                 name="address1"
//                 value={formData.address1}
//                 onChange={handleChange}
//                 className={`w-full border rounded px-3 py-2 ${
//                   errors.address1 ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter address 1"
//               />
//               {errors.address1 && (
//                 <p className="text-xs text-red-500 mt-1">{errors.address1}</p>
//               )}
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm mb-1">Address Line 2</label>
//               <input
//                 type="text"
//                 name="address2"
//                 value={formData.address2}
//                 onChange={handleChange}
//                 className="w-full border rounded px-3 py-2 border-gray-300"
//                 placeholder="Enter address 2"
//               />
//             </div>
//           </div>

//           {/* Address Tag & Default */}
//           <div className="flex items-center justify-between">
//             <div className="flex space-x-2">
//               {["HOME", "OFFICE", "OTHER"].map((tag) => (
//                 <label
//                   key={tag}
//                   className={`px-3 py-1 border rounded cursor-pointer text-sm ${
//                     formData.address_tag === tag
//                       ? "bg-pink-100 border-pink-500 text-pink-600"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="address_tag"
//                     value={tag}
//                     checked={formData.address_tag === tag}
//                     onChange={handleChange}
//                     className="hidden"
//                   />
//                   {tag}
//                 </label>
//               ))}
//             </div>
//             <label className="flex items-center text-sm space-x-2">
//               <input
//                 type="checkbox"
//                 name="default_address"
//                 checked={formData.default_address}
//                 onChange={handleChange}
//                 className="rounded border-gray-300"
//               />
//               <span>Make it default address</span>
//             </label>
//           </div>

//           {/* Submit Button */}
//           <div className="text-right">
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-3 py-1 border rounded cursor-pointer text-sm bg-pink-700 border-pink-500 text-white disabled:opacity-50"
//             >
//               {loading ? "Saving..." : "Submit"}
//             </button>
//           </div>
//         </form>

//         {/* Bottom Alert for multiple errors */}
//         {submitError && (
//           <div className="mt-4 bg-red-100 text-red-700 p-3 rounded flex justify-between items-center">
//             <span>{submitError}</span>
//             <button
//               onClick={() => setSubmitError("")}
//               className="text-red-500 font-bold"
//             >
//               &times;
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NewAddressModal;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserAddress,
  updateUserAddress,
} from "../../../Redux/Features/AddressServicesSlice";
import toast from "react-hot-toast";

const NewAddressModal = ({ onClose, addressToEdit }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.UserAddressOpration);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // -------------------------
  // Prefill form (Edit mode)
  // -------------------------
  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        name: addressToEdit.name || "",
        phone_number: addressToEdit.phone_number || "",
        area: addressToEdit.area || "",
        flat: addressToEdit.flat || "",
        postal_code: addressToEdit.postal_code || "",
        address1: addressToEdit.address1 || "",
        address2: addressToEdit.address2 || "",
        address_tag: addressToEdit.address_tag || "HOME",
        default_address: addressToEdit.default_address || false,
      });
    } else {
      setFormData({
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
  }, [addressToEdit]);

  // -------------------------
  // Handle input changes
  // -------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // -------------------------
  // Validation
  // -------------------------
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "The name field is required";
    if (!formData.phone_number.trim())
      newErrors.phone_number = "The phone field is required";
    if (!formData.address1.trim())
      newErrors.address1 = "The address line field is required";
    return newErrors;
  };

  // -------------------------
  // Submit
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      if (addressToEdit) {
        await dispatch(
          updateUserAddress({ id: addressToEdit.id, updateData: formData })
        ).unwrap();
        toast.success("Address updated successfully!");
      } else {
        await dispatch(addUserAddress(formData)).unwrap();
        toast.success("Address added successfully!");
      }
      onClose();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Operation failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-2">
      <div className="bg-white rounded-lg shadow-lg w-full overflow-auto max-w-3xl sm:w-[90%] md:w-[700px] p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
          {addressToEdit ? "Edit Address" : "New Address"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-sm sm:text-base ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter name"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Phone *</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-sm sm:text-base ${
                  errors.phone_number ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter phone"
              />
              {errors.phone_number && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone_number}
                </p>
              )}
            </div>
          </div>

          {/* Area, Flat, Postal Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Enter Area"
              className="border rounded px-3 py-2 border-gray-300 text-sm sm:text-base"
            />
            <input
              type="text"
              name="flat"
              value={formData.flat}
              onChange={handleChange}
              placeholder="Enter Flat no"
              className="border rounded px-3 py-2 border-gray-300 text-sm sm:text-base"
            />
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              placeholder="Enter Postal Code"
              className="border rounded px-3 py-2 border-gray-300 text-sm sm:text-base"
            />
          </div>

          {/* Address Line 1 & 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Address Line 1 *</label>
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-sm sm:text-base ${
                  errors.address1 ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter address 1"
              />
              {errors.address1 && (
                <p className="text-xs text-red-500 mt-1">{errors.address1}</p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Address Line 2</label>
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 border-gray-300 text-sm sm:text-base"
                placeholder="Enter address 2"
              />
            </div>
          </div>

          {/* Address Tag & Default */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex space-x-2">
              {["HOME", "OFFICE", "OTHER"].map((tag) => (
                <label
                  key={tag}
                  className={`px-3 py-1 border rounded cursor-pointer text-xs sm:text-sm ${
                    formData.address_tag === tag
                      ? "bg-pink-100 border-pink-500 text-pink-600"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="address_tag"
                    value={tag}
                    checked={formData.address_tag === tag}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {tag}
                </label>
              ))}
            </div>
            <label className="flex items-center text-xs sm:text-sm space-x-2">
              <input
                type="checkbox"
                name="default_address"
                checked={formData.default_address}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <span>Make it default address</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="text-center sm:text-right">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded text-sm sm:text-base bg-pink-700 text-white hover:bg-pink-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>

        {submitError && (
          <div className="mt-4 bg-red-100 text-red-700 p-3 rounded flex justify-between items-center text-sm">
            <span>{submitError}</span>
            <button
              onClick={() => setSubmitError("")}
              className="text-red-500 font-bold"
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewAddressModal;
