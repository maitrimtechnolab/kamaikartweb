import { API } from "../../../Axios";

export const PromocodeService = {
  // Get all banners
  GetAllPromocode: async () => {
    try {
      const res = await API.get("/web/promoCodes", {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  applyPromoCode: async (data) => {
    try {
      const res = await API.post("/web/checkout", data, {
        withCredentials: true,
      });

      console.log("hiii");

      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
