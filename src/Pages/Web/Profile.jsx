// pages/Profile.jsx
import React, { useState, useEffect } from "react";
import Header from "../Layout/Header";
import Sidebar from "../Layout/Sidebar";
import { getUserProfile, getUserProfileUpdate } from "../../api";
import toast from "react-hot-toast";
import Layout from "../Layout/Layout";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getUserProfile(token)
      .then((res) => {
        setName(res.data.data.name || "");
        setEmail(res.data.data.email || "");
        setPhone(res.data.data.phoneno || "");
      })
      .catch(() => {
        toast.error("Failed to load profile");
      });
  }, []);

  // ✅ Save profile
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    setLoading(true);
    try {
      await getUserProfileUpdate({ name, email, phone }, token);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const [preview, setPreview] = useState(
    "https://demo.readyecommerce.app/default/profile.jpg"
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  return (
    <>
      {/* Profile Content */}
      <main className="flex-1 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">My Profile</h2>

          <div className="gap-6 mb-6 flex flex-col justify-center items-center">
            {/* Profile Preview */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>
          {/* ✅ Save Button */}
          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
