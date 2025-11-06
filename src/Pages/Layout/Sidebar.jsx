// import { FaUser, FaHistory, FaHeart, FaLock, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";
// import { Link, useLocation } from "react-router-dom";
// const Sidebar = () => {
//     const location = useLocation(); // get current path
//     const menuItems = [
//     { name: "Dashboard", icon: <FaUser />, link: "/dashboard" },
//     { name: "Order History", icon: <FaHistory />, link: "/orders" },
//     { name: "Wishlist", icon: <FaHeart />, link: "/wishlist" },
//     { name: "Message", icon: <FaTicketAlt />, link: "/messages" },
//     { name: "My Profile", icon: <FaUser />, link: "/profile" },
//     { name: "Manage Address", icon: <FaMapMarkerAlt />, link: "/address" },
//     { name: "Support Ticket", icon: <FaTicketAlt />, link: "/support" },
//     { name: "Change Password", icon: <FaLock />, link: "/change-password" }
//   ];

//     const activeLink = "/dashboard"; // For demonstration, highlight Dashboard

//     return (
//         <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 mt-6">
//             <div className="p-6 border-b text-center">
//                 <img
//                     src="https://demo.readyecommerce.app/default/profile.jpg"
//                     alt="User Avatar"
//                     className="w-20 h-20 rounded-full mx-auto"
//                 />
//                 <h2 className="mt-4 text-lg font-semibold">Demo Customer</h2>
//                 <p className="text-sm text-gray-500">01000000405</p>
//             </div>
//             <nav className="p-4 space-y-1 h-[400px] overflow-y-auto">
//                 {menuItems.map((item, index) => (
//                     <Link
//                         key={index}
//                         to={item.link}
//                         className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium hover:bg-pink-50 hover:text-pink-600 transition-colors ${
//                             location.pathname === item.link ? "bg-pink-100 text-pink-600" : "text-gray-600"
//                         }`}
//                     >
//                         <span className="text-lg">{item.icon}</span>
//                         {item.name}
//                     </Link>
//                 ))}
//             </nav>
//         </aside>
//     );
// }

// export default Sidebar;
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaUser,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaIdCard,
  FaCreditCard,
  FaGift,
  FaWallet,
  FaChevronRight,
  FaBell,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const menuSections = [
    {
      title: "DashBoard",
      items: [
        {
          name: "Dashboard",
          icon: <FaShoppingBag />,
          link: "/dashboard",
          badge: null,
        },
      ],
    },
    {
      title: "MY ORDERS",
      items: [
        {
          name: "My Orders",
          icon: <FaShoppingBag />,
          link: "/orders",
          badge: null,
        },
      ],
    },
    {
      title: "ACCOUNT SETTINGS",
      items: [
        {
          name: "Profile Information",
          icon: <FaUser />,
          link: "/profile",
          badge: null,
        },
        {
          name: "Manage Addresses",
          icon: <FaMapMarkerAlt />,
          link: "/address",
          badge: null,
        },
      ],
    },
  ];

  // Don't render sidebar on mobile
  if (isMobile) {
    return null;
  }

  return (
    <aside className="hidden lg:block w-80 bg-white shadow-lg h-screen sticky top-0">
      {/* Navigation Sections */}
      <div className="h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar py-4">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {/* Section Header */}
            <div className="px-6 py-3">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                {section.title}
              </h3>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  to={item.link}
                  className={`flex items-center gap-4 px-6 py-4 mx-2 rounded-xl transition-all duration-200 group ${
                    location.pathname === item.link
                      ? "bg-blue-50 border-r-4 border-blue-500 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                  onMouseEnter={() => setActiveSection(item.name)}
                  onMouseLeave={() => setActiveSection("")}
                >
                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                      location.pathname === item.link
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>

                    {/* Badge and Arrow */}
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            item.badgeColor || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <FaChevronRight
                        className={`text-xs text-gray-400 transition-transform duration-200 ${
                          activeSection === item.name ? "translate-x-1" : ""
                        }`}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help?{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>

      {/* Custom CSS for scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
