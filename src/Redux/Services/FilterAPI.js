import { API } from "../../../Axios";

export const FilterService = {
  HomepageFilter: async () => {
    try {
      const res = await API.post(
        "/web/filter",
        {},
        {
          withCredentials: true,
        }
      );

      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  HomepageFilterAppliedData: async (category_id) => {
    try {
      const res = await API.post(
        "/web/filter",
        { category_id },
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
