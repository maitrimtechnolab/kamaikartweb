import { API } from "../../../Axios";

export const BuynowService = {
  BuyNow: async (product_id, quantity, variant_id, address_id, payment_id, razor_payment_id) => {
    try {
        const res = await API.post(
            "web/buyNow",
            { product_id, quantity, variant_id, address_id, payment_id, razor_payment_id },
            {
                withCredentials: true,
            }
        );
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
  },
};