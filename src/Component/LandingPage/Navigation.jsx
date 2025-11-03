import React, { useState } from "react";
import { Menu, X, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 inset-0 gradient-bg backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className=" p-2 rounded-lg">
              <img
                src="../../../public/Logo.png"
                className="h-12 w-12 rounded-full text-white"
              />
            </div>
            <span className="font-bold text-xl text-gray-900">KamaiKart</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-primary-50   px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-primary-50  px-3 py-2 text-sm font-medium transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("customers")}
                className="text-primary-50  px-3 py-2 text-sm font-medium transition-colors"
              >
                For Customers
              </button>
              <button
                onClick={() => scrollToSection("sellers")}
                className="text-primary-50   px-3 py-2 text-sm font-medium transition-colors"
              >
                For Sellers
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="btn-secondary text-sm">
              {" "}
              <Link to={"/home"}>Shop Now </Link>
            </button>
            <button className="btn-primary text-sm">
              {" "}
              <a to={"https://www.kamaikart.in/seller/register"}>
                Become a Seller
              </a>{" "}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium w-full text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium w-full text-left"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("customers")}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium w-full text-left"
              >
                For Customers
              </button>
              <button
                onClick={() => scrollToSection("sellers")}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium w-full text-left"
              >
                For Sellers
              </button>
              <div className="pt-4 space-y-2">
                <button className="btn-secondary text-sm w-full">
                  Shop Now
                </button>
                <button className="btn-primary text-sm w-full">
                  Become a Seller
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
