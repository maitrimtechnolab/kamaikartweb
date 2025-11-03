import React from "react";
import { motion } from "framer-motion";
import { Coins, Lock, Unlock, ShoppingCart, Clock } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: Coins,
      title: "Buy Coins",
      description: "Purchase digital coins through our secure platform",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      delay: 0.1,
    },

    {
      id: 2,
      icon: Lock,
      title: "Locked for 45 Days",
      description: "Coins are securely locked for 45 days with timer",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      delay: 0.3,
    },
    {
      id: 3,
      icon: Unlock,
      title: "Unlock & Shop",
      description: "Use unlocked coins for shopping and rewards",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      delay: 0.5,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-display">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            हमारा इनोवेटिव 'कॉइन + लॉक सिस्टम' आपकी खरीदारी को और भी फायदेमंद
            बनाता है। कॉइन्स खरीदें, उन्हें 45 दिनों तक होल्ड करें और फिर उन्हें
            शॉपिंग, रिवॉर्ड्स और बेनिफिट्स के लिए इस्तेमाल करें।
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-yellow-200 to-green-200 transform -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: step.delay }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step Card */}
                <div
                  className={`${step.bgColor} rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
                >
                  {/* Icon Container */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: step.delay + 0.2 }}
                    viewport={{ once: true }}
                    className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${step.color} rounded-full mb-6 shadow-lg`}
                  >
                    <step.icon className="h-10 w-10 text-white" />
                  </motion.div>

                  {/* Step Number */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: step.delay + 0.4 }}
                    viewport={{ once: true }}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-gray-50"
                  >
                    <span className="text-xl font-bold text-gray-700">
                      {step.id}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: step.delay + 0.6 }}
                    viewport={{ once: true }}
                    className="text-2xl font-bold text-gray-900 mb-4"
                  >
                    {step.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: step.delay + 0.8 }}
                    viewport={{ once: true }}
                    className="text-gray-600 leading-relaxed"
                  >
                    {step.description}
                  </motion.p>

                  {/* Special Elements for Step 1 */}
                  {step.id === 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                      viewport={{ once: true }}
                      className="mt-6 flex justify-center"
                    >
                      <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md">
                        <Coins className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          Digital Coins
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Special Elements for Step 2 */}
                  {step.id === 2 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                      viewport={{ once: true }}
                      className="mt-6 flex justify-center"
                    >
                      <div className="bg-white rounded-full p-4 shadow-md">
                        <div className="flex items-center space-x-3">
                          <Lock className="h-6 w-6 text-yellow-500" />
                          <div className="text-center">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-lg font-bold text-gray-700">
                                45
                              </span>
                              <span className="text-sm text-gray-500">
                                days
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Special Elements for Step 3 */}
                  {step.id === 3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.4 }}
                      viewport={{ once: true }}
                      className="mt-6 flex justify-center"
                    >
                      <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md">
                        <Unlock className="h-5 w-5 text-green-500" />
                        <ShoppingCart className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          Shop & Earn
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center mt-8 mb-8">
                    <div className="w-8 h-8 bg-gradient-to-b from-blue-200 to-yellow-200 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  100%
                </div>
                <div className="text-gray-600">Secure Locking</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">45</div>
                <div className="text-gray-600">Days Lock Period</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
                <div className="text-gray-600">Shopping Benefits</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
