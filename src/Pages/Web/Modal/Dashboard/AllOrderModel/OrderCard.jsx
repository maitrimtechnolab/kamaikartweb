import {
  Calendar,
  Package,
  Eye,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { OrderStatusBadge } from "../OrderStatusBadge";
import { OrderItem } from "./OrderItemModel";

export const OrderCard = ({
  order,
  isExpanded,
  onToggleExpansion,
  onViewDetails,
  onCancelOrder,
  onRateReview,
  onAskQuestion,
  formatPrice,
  formatDate,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    {/* Order Header */}
    <div className="border-b border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">
              Order #{order.id}
            </span>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="w-4 h-4" />
            <span className="font-medium text-gray-900">
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Order Items - Column Layout */}
    <div className="p-6">
      {/* Expand/Collapse Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Order Items ({order.items?.length || 0})
        </h3>
        <button
          onClick={onToggleExpansion}
          className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show All ({order.items.length})
            </>
          )}
        </button>
      </div>

      {/* Order Items List - Column Layout */}
      <div className="space-y-4 mb-6">
        {(isExpanded ? order.items : order.items?.slice(0, 3))?.map((item) => (
          <OrderItem
            key={item.id}
            item={item}
            order={order}
            onRateReview={onRateReview}
            onAskQuestion={onAskQuestion}
            formatPrice={formatPrice}
          />
        ))}
      </div>
     
      {/* Show more indicator when not expanded */}
      {!isExpanded && order.items?.length > 3 && (
        <button
          onClick={onToggleExpansion}
          className="block mx-auto text-sm text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          +{order.items.length - 3} more items
        </button>
      )}

      {/* Order Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{order.items?.length || 0} items</span>
          {" • "}
          <span>Total: {formatPrice(order.total_amount)}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Payment: </span>
          <span
            className={`font-medium ${
              order.razorpay_payment_id ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {order.razorpay_payment_id ? "Paid" : "Pending"}
          </span>
        </div>
      </div>

      {/* Order Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => onViewDetails(order)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>

        {(order.status === "pending" || order.status === "confirmed") && (
          <button
            onClick={() => onCancelOrder(order)}
            className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  </div>
);
